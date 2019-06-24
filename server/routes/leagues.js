var express = require('express');
var router = express.Router();
var rp = require('request-promise');


const riot = require('../riot');

router.use((req, res, next) => {
  ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (ip.substr(0, 7) == "::ffff:") ip = ip.substr(7);
  region = req.headers.host.split(".")[0].replace("http://", "")
  League = require('../models/league')(region);
  RiotLeague = require('../riot/league')(region);
  next();
})

//find league by id
router.get('/:id', (req,res) => {
  var id = req.params.id;
  League.find({summonerId: id}, (err, leagues) => {
    if (leagues > 0) {
      res.status(200).json(leagues)
    } else {
      RiotLeague.bySummonerID(id, leagues => {
        if (leagues) {
          leagues.forEach(league => {
            //format league
            var newLeague = new League(league)
            newLeague.save((err, league) => {})
          })
          res.status(200).json(leagues)
        } else {
          res.status(400).json("not found")
        }
      })
    }
  })
})

//find league by name
router.get('/by-name/:name', (req,res) => {
  var regex = new RegExp(`^${req.params.name}$`, "i")
  League.find({summonerName: regex}, (err, leagues) => {
    if (err) return res.status(400).json(err)
    res.status(200).json(leagues)
  })
})

//post new league for user  
router.post('/', (req,res) => {
  var newLeague = new League(req.body.league)
  League.findOne({queueType: newLeague.queueType, summonerId: newLeague.summonerId}, (err, league) => {
    if (!league) {
      newLeague.save((err, league) => {
        if (err) return res.status(400).json(err)
        res.status(200).json(league)
      })
    } else {
      res.status(400).json("already exists")
    }
  })
})

//put league for user
router.put('/', (req,res) => {
  var updatedLeague = new League(req.body.league)
  League.findOne({queueType: updatedLeague.queueType, summonerId: updatedLeague.summonerId}, (err, league) => {
    if (league) {
      league.delete();
      updatedLeague.save((err, league) => {
        if (err) return res.status(400).json(err)
        res.status(200).json(league)
      })
    } else {
      updatedLeague.save((err, league) => {
        if (err) return res.status(400).json(err)
        res.status(200).json(league)
      })
    }
  })
})
module.exports = router