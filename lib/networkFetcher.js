const fetch = require('node-fetch')
const {performance} = require('perf_hooks')
const parse = require('./VATSIMParser');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/test"

const runScript = async (db) => {
    const t0 = performance.now();
    try{
        if(db.get() == null) {
            console.log("[!] Network Fetcher cannot connect to DB");
            return
        }
        const data = await networkFetch(db.get().collection('airports'));
        
        const t1 = performance.now();
        console.log(`[*] Fetched from vatsim after ${t1-t0} ms.`);
        
        const current_flights = db.get().collection("current_flights");
        const flights_history = db.get().collection("flights_history");

        
        const currentTimestamp = data.pilots[0].timestamp;

        // we insert the new data
        await insertToDB(data.pilots, current_flights)
        
        await insertToDB(data.atc, current_flights)

        await current_flights.deleteMany({timestamp: {$lt: currentTimestamp}})

        // Then we clear the collection
        // current_flights.deleteMany({timestamp: { $not: { $ne: currentTimestamp }}});
        
        // Update pireps
        for (const flight of data.pilots) {
            const {callsign, cid, coords, altitude, speed, heading, timestamp } = flight;
            const {lat, long} = coords;
            const pirep = {lat, lng: long, alt: altitude, spd: speed, hd: heading, ts: timestamp};

            await updateTrail(callsign, cid, pirep, flights_history);
        }

        
        // Delete unused trackers, usually people who disconnected
        await flights_history.deleteMany({'trail.0.ts': {$lt: currentTimestamp }});

        const t2 = performance.now();
        console.log(`[*] Fetched and inserted ${data.pilots.length} flights and ${data.atc.length} controllers at ${Date(Date.now()).toString()}, in ${t2-t0} ms.`)
    } catch (error) {
        console.log(error);
    }


    
}


const networkFetch = async (airportsCollection) => {

    const servers = [
        'http://info.vroute.net/vatsim-data.txt',
        'http://vatsim-data.hardern.net/vatsim-data.txt',
        'http://info.vroute.net/vatsim-data.txt'
    ]

    try {
        let rawData = await fetch(servers[0]);
        rawData =  await rawData.text();
        return parse(rawData, airportsCollection);


    } catch (error) {
        console.log(error)
    }
}

const insertToDB = async (data, collection) => {
    try {
        await collection.insertMany(data)
    } catch (error) {
        console.warn(error);
    }


}

const updateTrail = async (callsign, cid, pirep, collection) => {
    try {
        const document = await collection.findOneAndUpdate({callsign, cid}, {$push: {"trail": {$each: [pirep], $position: 0}}});
  
        if(document.value === null){
            await collection.insertOne({
                callsign,
                cid,
                trail: [
                    pirep
                ]
            })
        }
    } catch (error) {
        console.warn(error)
    }
    
}

module.exports = runScript;