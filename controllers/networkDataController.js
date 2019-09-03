// eslint-disable-next-line no-undef
var db = require('../db')

const getFocusedAircraft = async (callsign) => {
    let data = null;
    try {
      const current_flights = db.get().collection('current_flights');
      const trails = db.get().get().collection('flights_history');
      const flight = await current_flights.findOne({callsign: callsign});
      const { cid } = flight;
      const trailDoc = await trails.findOne({callsign: callsign, cid: cid});
  
      flight["trail"] = trailDoc.trail;
      data = flight;
  
    } catch (error) {
      console.log(error)
    }
    return data;
  }

const getAllStations = async () => {
    let pilots = []
    let atc = []
    try {
      const collection = db.get().collection('current_flights');
      pilots = await collection.find({'type': 'pilot'}).toArray();
      atc = await collection.find({'type': 'atc'}).toArray();
      return {pilots, atc};
    } catch (error) {
      console.log(error)
      return {pilots: [], atc: []}
    }
  }

const updateAllStations = async (stations) => {
  await db.get().collection("current_flights").insertMany(stations)
}

const getAirportByICAO = async (icao) => {
  return await db.get().collection('airports').findOne({'code.icao': icao});
}

const cleanOldStations = async (lastTimeStamp) => {
  await db.get().collection('airports').deleteMany({timestamp: {$lt: lastTimeStamp}})
}

const updateTrail = async (callsign, cid, pirep) => {
  try {
      const collection = db.get().collection("flights_history");
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

const cleanOldTrails = async (lastTimeStamp) => {
  await db.get().collection('flights_history').deleteMany({'trail.0.ts': {$lt: lastTimeStamp }});
}

module.exports = {
    getFocusedAircraft,
    getAllStations,
    getAirportByICAO,
    updateAllStations,
    cleanOldStations,
    updateTrail,
    cleanOldTrails
}