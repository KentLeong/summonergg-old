var express = require('express');
var router = express.Router();
var rp = require('request-promise');
const riot = require('../riot');
String.prototype.capitalize = () => {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
var region
var Match

router.use((req, res, next) => {
  region = req.headers.host.split(".")[0].replace("http://", "")
  Match = require('../models/match')(region);
  next();
})

// GET all Matches (probably not a good idea to use)
router.get('/', (req, res) => {
  Match.find()
    .exec((err, matchs) => {
      if (err) return res.status(400).json(err)
      res.status(200).json(matchs)
    });
});

// get match by id
router.get('/:id', (req, res) => {
  Match.findOne({gameId: req.params.id}, (err, match) => {
    if (err) {return res.status(400).json(err);}
    if (!match) {return res.status(400).json("match does not exist");}
    res.status(200).json(match);
  })
})

router.post('/', (req, res) => {
  console.log(req.body.match)
  Match.findOne({gameId: req.body.match.gameId}, (err, match) => {
    if (match) {return res.status(400).json("match exists");}
    var newMatch = new Match(req.body.match);
    newMatch.save((err, match) => {
      if (err) {return region.status(400).json(err);}
      res.status(200).json(match)
    })
  })
})
/**
 * R I O T A P I
 * 
 * 
 * 
 */
// Find match from api by id
router.get('/riot/by-id/:id', (req, res) => {
  rp(`https://${riot.endpoints[region]}.api.riotgames.com/lol/match/v4/matches/`+
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
  rp(`https://${riot.endpoints[region]}.api.riotgames.com/lol/match/v4/matchlists/by-account/`+
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