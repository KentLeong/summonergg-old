var express = require('express');
var router = express.Router();
var rp = require('request-promise');


const riot = require('../config/riot');

router.use((req, res, next) => {
  ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (ip.substr(0, 7) == "::ffff:") ip = ip.substr(7);
  region = req.headers.host.split(".")[0].replace("http://", "")
  League = require('../models/league')(region);
  LeagueService = require('../service/league')(region);
  RiotLeague = require('../riot/league')(region);
  next();
})

// GET League
router.get('/:id', (req, res) => {
  League.findOne({summonerId: req.params.id}, (err, league) => {
    if (err) {
      res.status(500).json(err)
    } else {
      res.status(200).json(league)
    }
  })
})

// POST League
router.post('/', (req, res) => {
  var newLeague = new League(req.body.league)
  League.findOne({summonerId: newLeague.summonerId}, (err, league) => {
    if (league) {
      res.status(400).json("exists")
    } else {
      newLeague.save((err, league) => {
        if (err) {
          res.status(500).json(err)
        } else {
          res.status(200).json(league)
        }
      })
    }
  })
})

// DELETE League
router.delete('/:id', (req, res) => {
  League.findOneAndDelete({summonerId: req.params.id}, (err, league) => {
    if (err) {
      res.status(500).json("could not delete")
    } else {
      res.status(200).json("deleted")
    }
  })
})

// PUT league
router.put('/', (req, res) => {
  var league = req.body.league
  League.findOneAndUpdate({summonerId: league.summonerId}, league, {new: true}, (err, league) => {
    if (err) {
      res.status(500).json(err)
    } else {
      res.status(200).json(league)
    }
  })
})

//find league by name
router.get('/name/:name', (req,res) => {
  var name = req.params.name.split("").join("\\s*")
  var regex = new RegExp(`^${name}$`, "i")
  League.find({summonerName: regex}, (err, leagues) => {
    if (err) {
      res.status(500).json(err)
    } else if (leagues.length == 0) {
      res.status(400).json(leagues)
    } else {
      res.status(200).json(leagues)
    }
  })
})

module.exports = router