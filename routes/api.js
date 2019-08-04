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

router.get('/data', async function(req, res, next) {
  try {
    const data = await getAllAircraft();
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


const getAllAircraft = async () => {
  let data = []
  try {
    const collection = db.get().collection('current_flights');
    data = await collection.find({}).toArray();

  } catch (error) {
    console.log(error)
  } finally {
    return data;
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
  } finally {
    return data;
  }
}


module.exports = router;
