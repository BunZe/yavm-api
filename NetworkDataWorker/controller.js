/* eslint-disable no-undef */
var db = require('../db')
const updateAllStations = async stations => {
  await db
    .get()
    .collection("current_flights")
    .insertMany(stations);
};

const getAirportByICAO = async icao => {
  return await db
    .get()
    .collection("airports")
    .findOne({ "code.icao": icao });
};

const cleanOldStations = async lastTimeStamp => {
  await db
    .get()
    .collection("current_flights")
    .deleteMany({ timestamp: { $lt: lastTimeStamp } });
};

const updateTrail = async (callsign, cid, pirep) => {
  try {
    const collection = db.get().collection("flights_history");
    const document = await collection.findOneAndUpdate(
      { callsign, cid },
      { $push: { trail: { $each: [pirep], $position: 0 } } }
    );

    if (document.value === null) {
      await collection.insertOne({
        callsign,
        cid,
        trail: [pirep]
      });
    }
  } catch (error) {
    console.warn(error);
  }
};

const cleanOldTrails = async lastTimeStamp => {
  await db
    .get()
    .collection("flights_history")
    .deleteMany({ "trail.0.ts": { $lt: lastTimeStamp } });
};

module.exports = {
  updateAllStations,
  getAirportByICAO,
  cleanOldStations,
  cleanOldTrails,
  updateTrail
};
