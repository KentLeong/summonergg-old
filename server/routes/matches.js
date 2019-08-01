module.exports = (serverList) => {
  var express = require('express');
  var router = express.Router();
  const riot = require('../config/riot');
  
  Array.prototype.asyncForEach = async function(cb) {
    for(let i=0; i<this.length; i++) {
      await cb(this[i], i, this)
    }
  }
  var region
  var Match
  
  router.use((req, res, next) => {
    region = req.headers.host.split(".")[0].replace("http://", "")
    var MatchService = require('../service/match')(region);
    var time = req.query.epoch;
    if (!time) time = req.query.date;
    var type = req.query.type
    if (time && riot.types.includes(type) || time == "recent") {
      MatchService.getLocation(time, type, (recent, location) => {
        if (recent) {
          Match = require('../models/match')(serverList[region].main, location);
        } else {
          Match = require('../models/match')(serverList[region].match, location);
        }
      })
      RiotMatch = require('../riot/match')(region);
      next();
    }
  })
  
  // GET Match
  router.get('/:id', (req, res) => {
    Match.findOne({gameId: req.params.id}, (err, match) => {
      if (err) {
        res.status(500).json(err)
      } else if (!match) {
        res.status(400).json("not found")
      } else {
        res.status(200).json(match)
      }
    })
  })

  // GET Match
  router.get('/by-id/:id', (req, res) => {
    Match.findOne({_id: req.params.id}, (err, match) => {
      if (err) {
        res.status(500).json(err)
      } else if (!match) {
        res.status(400).json("not found")
      } else {
        res.status(200).json(match)
      }
    })
  })
    
  // POST Match
  router.post('/', (req, res) => {
    var newMatch = new Match(req.body.match)
    Match.findOne({gameId: newMatch.gameId}, (err, match) => {
      if (match) {
        res.status(400).json("exists")
      } else if (match.queueId != "420" || match.queueId != "440" || match.queueId != "470" || match.queueId != "0") {
        res.status(400).json("not saving this queue type")
      } else {
        newMatch.participants.forEach(part => {
          if (part.matchHistoryUri) delete part.matchHistoryUri;
          if (part.profileIcon) delete part.profileIcon;
          if (part.highestAchievedSeasonTier) delete part.highestAchievedSeasonTier;
          if (part.participantId) delete part.participantId;
          if (part.platformId) delete part.platformId;
        })
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
  
  // DELETE Match
  router.delete('/:id', (req, res) => {
    Match.findOneAndDelete({matchId: req.params.id}, (err, match) => {
      if (err) {
        res.status(500).json("could not delete")
      } else {
        res.status(200).json("deleted")
      }
    })
  })
  
  // PUT match
  router.put('/', (req, res) => {
    var match = req.body.match
    Match.findOneAndUpdate({matchId: match.matchId}, match, {new: true}, (err, match) => {
      if (err) {
        res.status(500).json(err)
      } else {
        res.status(200).json(match)
      }
    })
  })
  
  // get multi matches by id
  router.get('/multi/:id', (req, res) => {
  /** 
    * OPTIONS***
    * champion
    * season
    * skip 
    * limit
    * queueId
    **/
    var options = req.query;
    var query = {
      participants: {
        $elemMatch: {
          currentAccountId: req.params.id
        }
      }
    }
    if (options.queue) query.queueId = options.queueId
    if (options.seasonId) query.seasonId = options.seasonId;
    if (options.championId) query.participants.$elemMatch.championId = options.championId;
    Match.find(query).sort({gameCreation: 'descending'}).skip(+options.skip).limit(+options.limit).exec((err, matches) => {
      if (err) {return res.status(400).json(err);}
      res.status(200).json(matches)
    })
  })

  return router
}