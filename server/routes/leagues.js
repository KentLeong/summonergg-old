var express = require('express');
var router = express.Router();
var rp = require('request-promise');


const riot = require('../riot');
String.prototype.capitalize = () => {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

router.use((req, res, next) => {
  ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (ip.substr(0, 7) == "::ffff:") ip = ip.substr(7);
  region = req.headers.host.split(".")[0].replace("http://", "")
  League = require('../models/league')(region);
  next();
})

//find league by id
router.get('/:id', (req,res) => {
  League.find({summonerId: req.params.id}, (err, leagues) => {
    if (err) return res.status(400).json(err)
    res.status(200).json(leagues)
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
/**
 * R I O T A P I
 * 
 * 
 * 
 */
// Find league from api by id
router.get('/riot/by-id/:id', (req, res) => {
  rp(`https://${riot.endpoints[region]}.api.riotgames.com/lol/league/v4/entries/by-summoner/`+
  `${req.params.id}?api_key=${riot.key}`)
    .then(data => {
      var league = JSON.parse(data)
      res.status(200).json(league)
    })
    .catch(err => {
      res.status(400).json(err)
    })
})

//Find division by League id
router.get('/riot/league/:id', (req, res) => {
  rp(`https://${riot.endpoints[region]}.api.riotgames.com/lol/league/v4/leagues/`+
  `${req.params.id}?api_key=${riot.key}`)
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
  rp(`https://${riot.endpoints[region]}.api.riotgames.com/lol/league/v4/entries/`+
  `${req.params.queue}/${req.params.tier}/${req.params.division}?api_key=${riot.key}`)
    .then(data => {
      var divison = JSON.parse(data)
      res.status(200).json(divison)
    })
    .catch(err => {
      res.status(400).json(err)
    })
})
//Find challenger division by queue type
router.get('/riot/challenger/:queue', (req, res) => {
  rp(`https://${riot.endpoints[region]}.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/`+
  `${req.params.queue}?api_key=${riot.key}`)
    .then(data => {
      var league = JSON.parse(data)
      res.status(200).json(league)
    })
    .catch(err => {
      res.status(400).json(err)
    })
})

//Find challenger division by queue type
router.get('/riot/grandmaster/:queue', (req, res) => {
  rp(`https://${riot.endpoints[region]}.api.riotgames.com/lol/league/v4/grandmasterleagues/by-queue/`+
  `${req.params.queue}?api_key=${riot.key}`)
    .then(data => {
      var league = JSON.parse(data)
      res.status(200).json(league)
    })
    .catch(err => {
      res.status(400).json(err)
    })
})

//Find challenger division by queue type
router.get('/riot/master/:queue', (req, res) => {
  rp(`https://${riot.endpoints[region]}.api.riotgames.com/lol/league/v4/masterleagues/by-queue/`+
  `${req.params.queue}?api_key=${riot.key}`)
    .then(data => {
      var league = JSON.parse(data)
      res.status(200).json(league)
    })
    .catch(err => {
      res.status(400).json(err)
    })
})
module.exports = router