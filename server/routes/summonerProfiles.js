var express = require('express');
var router = express.Router();
var rp = require('request-promise');


const riot = require('../riot');
String.prototype.capitalize = () => {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

var region;
var Summoner;
var Match;
var League;
var SummonerProfile;
var region;

router.use((req, res, next) => {
  region = req.headers.host.split(".")[0].replace("http://", "");
  SummonerProfile = require('../models/summonerProfile')(region);
  Summoner = require('../models/summoner')(region);
  Match = require('../models/match')(region);
  League = require('../models/league')(region);
  next();
})

router.get('/:name', (req, res) => {
  var name = req.params.name.split("").join("\\s*")
  var regex = new RegExp(`^${name}$`, "i")
  SummonerProfile.findOne({'summoner.name': regex}, (err, profile) => {
    if (err) return res.status(500).json(err);
    if (!profile) return res.status(404).json("not found");
    res.status(200).json(profile);
  })
})

router.post('/', (req, res) => {
  var name = req.body.profile.summoner.name;
  var summoner = req.body.profile.summoner;
  var leagues = req.body.profile.leagues;
  var matches = req.body.profile.matches;

  var queryName = name.split("").join("\\s*")
  var regex = new RegExp(`^${queryName}$`, "i")
  SummonerProfile.findOne({'summoner.name': regex }, (err, profile) => {
    if (profile) {
      profile.delete();
    }
    var newProfile = new SummonerProfile({
      summoner: summoner,
      leagues: leagues,
      matches: matches,
      lastUpdated: new Date()
    })
    newProfile.save((err, profile) => {
      if (err) return res.status(400).json(err);
      res.status(200).json(profile);
    })
  })
})

router.patch('/', (req, res) => {
  var name = req.body.profile.name;
  var summoner = req.body.profile.summoner;
  var leagues = req.body.profile.leagues;
  var matches = req.body.profile.matches;

  var queryName = name.split("").join("\\s*")
  var regex = new RegExp(`^${queryName}$`, "i")
  SummonerProfile.findOne({'summoner.name': regex }, (err, profile) => {
    if (!profile) return res.status(400).json("profile doesnt exists");
    profile.name = "";
    profile.summoner = {};
    profile.leagues = [];
    profile.matchHistory = [];
    profile.save((err, profile) => {
      if (err) return res.status(400).json(err);
      profile.name = name;
      profile.summoner = summoner;
      profile.leagues = leagues;
      profile.matchHistory = matches;
      profile.save((err, profile) => {
        if (err) return res.status(400).json(err);
        return res.status(200).json(profile)
      })
    })
  })
})
module.exports = router

