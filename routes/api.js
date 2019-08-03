/* eslint-disable no-undef */
var express = require('express');
var router = express.Router();
var networkFetch = require('../lib/networkFetcher').networkFetch;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/data', async function(req, res, next) {
  res.send(await networkFetch())
});


module.exports = router;
