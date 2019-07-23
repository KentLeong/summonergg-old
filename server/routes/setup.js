module.exports = (serverList) => {
  var express = require('express');
  var router = express.Router();
  
  
  const riot = require('../config/riot');
  
  router.use((req, res, next) => {
    ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip.substr(0, 7) == "::ffff:") ip = ip.substr(7);
    region = req.headers.host.split(".")[0].replace("http://", "")
    MatchQueue = require('../models/setup/matchQueue')(serverList[region].main);
    ProfileQueue = require('../models/setup/profileQueue')(serverList[region].main);
    SummonerQueue = require('../models/setup/summonerQueue')(serverList[region].main);
    next();
  })
  
  // GET match queue
  router.get('/matches/', (req, res) => {
    MatchQueue.find().limit(1000).exec((err, matches) => {
      if (err) {
        res.status(500).json(err)
      } else {
        res.status(200).json(matches)
      }
    })
  })

  // GET profile queue
  router.get('/profiles/', (req, res) => {
    ProfileQueue.find().limit(1000).exec((err, profiles) => {
      if (err) {
        res.status(500).json(err)
      } else {
        res.status(200).json(profiles)
      }
    })
  })  
  
  // GET summoner queue
  router.get('/summoners/', (req, res) => {
    SummonerQueue.count().exec(function (err, count) {
      var random = Math.floor((Math.random() * count)/300)
      SummonerQueue.find().skip(random).limit(300).exec((err, summoners) => {
        if (err) {
          res.status(500).json(err)
        } else {
          res.status(200).json(summoners)
        }
      })
    })
  })

  // POST Match
  router.post('/matches/', (req, res) => {
    var newMatch = new MatchQueue(req.body.match)
    MatchQueue.findOne({gameId: newMatch.gameId}, (err, match) => {
      if (match) {
        res.status(400).json("exists")
      } else {
        newMatch.save((err, match) => {
          if (err) {
            res.status(500).json(err)
          } else {
            res.status(200).json(match)
          }
        })
      }
    })
  })

  // POST Profile
  router.post('/profiles/', (req, res) => {
    var newProfile = new ProfileQueue(req.body.profile)
    ProfileQueue.findOne({puuid: newProfile.puuid}, (err, profile) => {
      if (profile) {
        res.status(400).json("exists")
      } else {
        newProfile.save((err, profile) => {
          if (err) {
            res.status(500).json(err)
          } else {
            res.status(200).json(profile)
          }
        })
      }
    })
  })

  // POST Summoner
  router.post('/summoners/', (req, res) => {
    var newSummoner = new SummonerQueue(req.body.summoner)
    SummonerQueue.findOne({summonerId: newSummoner.summonerId}, (err, summoner) => {
      if (summoner) {
        res.status(400).json("exists")
      } else {
        newSummoner.save((err, summoner) => {
          if (err) {
            res.status(500).json(err)
          } else {
            res.status(200).json(summoner)
          }
        })
      }
    })
  })

  // DELETE Match
  router.delete('/matches/:id', (req, res) => {
    MatchQueue.remove({gameId: req.params.id}, (err) => {
      if (err) {
        res.status(500).json(err)
      } else {
        res.status(200).json("deleted")
      }
    })
  })

  // DELETE Profile
  router.delete('/profiles/:id', (req, res) => {
    ProfileQueue.remove({puuid: req.params.id}, (err) => {
      if (err) {
        res.status(500).json(err)
      } else {
        res.status(200).json("deleted")
      }
    })
  })

  // DELETE Summoner
  router.delete('/summoners/:id', (req, res) => {
    SummonerQueue.remove({summonerId: req.params.id}, (err) => {
      if (err) {
        res.status(500).json(err)
      } else {
        res.status(200).json("deleted")
      }
    })
  })
  return router
}
