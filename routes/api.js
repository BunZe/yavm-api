/* eslint-disable no-undef */
var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/"
var db = require('../db')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('YAVM API: Version 0.1');
});

router.get('/firs', async (req, res, next) => {

});

router.get('/data', async function(req, res, next) {
  try {
    const stations = await getAllStations();
    const data = {pilots: stations.pilots, atc: stations.atc};
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.get('/data/:callsign', async function(req, res, next) {
  try {
    const data = await getFocusedAircraft(req.params.callsign);
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});


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

const getFocusedAircraft = async (callsign) => {
  let data = null;
  try {
    const current_flights = db.get().collection('current_flights');
    const trails = db.get().collection('flights_history');
    flight = await current_flights.findOne({callsign: callsign});
    const { cid } = flight;
    trailDoc = await trails.findOne({callsign: callsign, cid: cid});

    flight["trail"] = trailDoc.trail;
    data = flight;

  } catch (error) {
    console.log(error)
  }
  return data;
}


module.exports = router;
