/* eslint-disable no-undef */
var express = require('express');
var router = express.Router();
var aircraftController = require('../controllers/controller')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('YAVM API: Version 0.2');
});

router.get('/firs', async (req, res, next) => {

});

router.get('/data', async function(req, res, next) {
  try {
    const stations = await aircraftController.getAllStations();
    const data = {pilots: stations.pilots, atc: stations.atc};
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.get('/data/:callsign', async function(req, res, next) {
  try {
    const data = await aircraftController.getFocusedAircraft(req.params.callsign);
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});


module.exports = router;
