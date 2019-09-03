/* eslint-disable no-undef */
const db = require('../db');
const controller = require('../controllers/networkDataController');
const { networkFetch } = require('./fetcher');
const parser = require('./parser');
const {performance} = require('perf_hooks');

async function runJob() {
    console.log(`[-] Beginning Data Job`);
    // For debugging and optimization purposes.
    const startTime = performance.now();

    try {
        // First we check for a DB Connection, because it will be used by some of the functions called later.
        if(db.get() == null) {
            throw "[!] Network Data Manager cannot connect to DB";
        }

        // Fetching the data from our source.
        const rawData = await networkFetch();
        const fetchTime = performance.now();
        console.log(`[*] Fetched data after ${fetchTime-startTime} ms.`);

        // Parse data using default exported parser.
        const parsedData = await parser(rawData);
        const parseTime = performance.now();
        console.log(`[*] Parsed data after ${parseTime-fetchTime} ms.`);

        // Insert Data into our database;
        await controller.updateAllStations(parsedData);
        const insertTime = performance.now();
        console.log(`[*] Inseted data into Mongo after ${insertTime-parseTime} ms.`);

        // Remove old stations, filtering them out based on their timestamp.
        const lastTimestamp = parsedData[0].timestamp;
        await controller.cleanOldStations(lastTimestamp);
        const cleanTime = performance.now();
        console.log(`[*] Cleaned old data from Mongo after ${cleanTime-insertTime} ms.`);

        // Update pilot trails
        await updateTrails(parsedData);
        const trailUpdateTime = performance.now();
        console.log(`[*] Updated flight trails after ${trailUpdateTime-cleanTime} ms.`);

        await controller.cleanOldTrails(lastTimestamp);
        const trailCleanTime = performance.now();
        console.log(`[*] Cleaned old flight trails after ${trailCleanTime-trailUpdateTime} ms.`);



    } catch(error){
        console.warn(error);
    }

    const endTime = performance.now()
    console.log(`[-] Finished Job after ${endTime-startTime} ms.\n`);
}

/*
    Takes all pilots and updates their pirep/trail list.
*/
async function updateTrails(data) {
    for (const flight of data) {
        if(flight.type === "pilot") {
            const {callsign, cid, coords, altitude, speed, heading, timestamp } = flight;
            const {lat, long} = coords;
            const pirep = {lat, lng: long, alt: altitude, spd: speed, hd: heading, ts: timestamp};
    
            await controller.updateTrail(callsign, cid, pirep);
        }
    }
}

module.exports = runJob;