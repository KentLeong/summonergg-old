var express = require('express');
var router = express.Router();
var rp = require('request-promise');
var Match = require('../models/match');
const riot = require('../riot');
String.prototype.capitalize = () => {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

var region = "na1"

// GET all Matches (probably not a good idea to use)
router.get('/', (req, res) => {
  Match.find()
    .exec((err, matchs) => {
      if (err) return res.status(400).json(err)
      res.status(200).json(matchs)
    });
});
/**
 * R I O T A P I
 * 
 * 
 * 
 */
// Find match from api by id
router.get('/riot/by-id/:id', (req, res) => {
  rp(`https://${region}.api.riotgames.com/lol/match/v4/matches/`+
  `${req.params.id}?api_key=${riot.key}`)
    .then(data => {
      var match = JSON.parse(data)
      res.status(200).json(match)
    })
    .catch(err => {
      res.status(400).json(err)
    })
})

router.get('/riot/by-account/:id/:options', (req, res) => {
  /** 
  * OPTIONS***
  * champion
  * season
  * endTime - miliseconds 
  * beginTime - miliseconds
  * endIndex
  * beginIndex
  * 
  * format ex: "endtime=12&beginTime=0&"
  **/
  var options = req.params.options;
  if (!options) options = "";
  rp(`https://${region}.api.riotgames.com/lol/match/v4/matchlists/by-account/`+
  `${req.params.id}?`+options+`api_key=${riot.key}`)
    .then(data => {
      var match = JSON.parse(data)
      res.status(200).json(match)
    })
    .catch(err => {
      res.status(400).json(err)
    })
})
module.exports = router