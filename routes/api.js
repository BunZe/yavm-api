/* eslint-disable no-undef */
var express = require('express');
var router = express.Router();
var controller = require('../controllers/controller')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('YAVM API: Version 0.2');
});

router.get('/airports', async (req, res, next) => {
  const airports = await controller.getAirports();
  res.json(airports);
});

router.get('/data', async function(req, res, next) {
  try {
    const stations = await controller.getAllStations();
    const data = {pilots: stations.pilots, atc: stations.atc};
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.get('/data/:callsign', async function(req, res, next) {
  try {
    const data = await controller.getFocusedAircraft(req.params.callsign); 
    if(data == null){
      res.status(404)
      res.send("aircraft not found");
      
    } else {
      res.json(data);
    }
  } catch (error) {
    console.log(error);
  }
});


module.exports = router;
