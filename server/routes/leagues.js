var express = require('express');
var router = express.Router();
var rp = require('request-promise');
var Storage = require('node-storage');

const config = require('../../config');
String.prototype.capitalize = () => {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

router.use((req, res, next) => {
  ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (ip.substr(0, 7) == "::ffff:") ip = ip.substr(7);
  region = req.headers.host.split(".")[0].replace("http://", "")
  Summoner = require('../models/summoner')(region);
  next();
})



/**
 * R I O T A P I
 * 
 * 
 * 
 */
// Find league from api by id
router.get('/riot/by-id/:id', (req, res) => {
  rp(`https://${config.endpoints[region]}.api.riotgames.com/lol/league/v4/entries/by-summoner/`+
  `${req.params.id}?api_key=${config.riot}`)
    .then(data => {
      var league = JSON.parse(data)[0]
      res.status(200).json(league)
    })
    .catch(err => {
      res.status(400).json(err)
    })
})

//Find division by League id
router.get('/riot/league/:id', (req, res) => {
  rp(`https://${config.endpoints[region]}.api.riotgames.com/lol/league/v4/leagues/`+
  `${req.params.id}?api_key=${config.riot}`)
    .then(data => {
      var league = JSON.parse(data)
      res.status(200).json(league)
    })
    .catch(err => {
      res.status(400).json(err)
    })
})

//Find whole divison
router.get('/riot/divison/:queue/:tier/:division', (req, res) => {
  rp(`https://${config.endpoints[region]}.api.riotgames.com/lol/league/v4/leagues/`+
  `${req.params.id}?api_key=${config.riot}`)
    .then(data => {
      var divison = JSON.parse(data)
      res.status(200).json(divison)
    })
    .catch(err => {
      res.status(400).json(err)
    })
})
module.exports = router