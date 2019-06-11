var express = require('express');
var router = express.Router();
var rp = require('request-promise');
var Summoner = require('../models/summoner');
var Storage = require('node-storage');

const config = require('../../config');
String.prototype.capitalize = () => {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
var region;

router.use((req, res, next) => {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (ip.substr(0, 7) == "::ffff:") {
    ip = ip.substr(7)
  }
  region = req.headers.host.split(".")[0].replace("http://", "")
  console.log(ip)
  next();
})

// GET all Summoners (probably not a good idea to use)
router.get('/', (req, res) => {
  Summoner.find()
    .exec((err, summoners) => {
      if (err) return res.status(400).json(err)
      res.status(200).json(summoners)
    });
});

// GET name
router.get('/:name', (req, res) => {
  var regex = new RegExp(`^${req.params.name}$`, "i")
  Summoner.findOne({name: regex}, (err, summoner) => {
    if (err) return res.status(400).json(err)
    res.status(200).json(summoner)
  }) 
})

// POST new summoner
router.post('/', (req, res) => {
  var newSummoner = new Summoner(req.body.summoner)
  Summoner.findOne({name: newSummoner.name}, (err, summoner) => {
    if (!summoner) {
      newSummoner.save((err, summoner) => {
        if (err) return res.status(400).json(err)
        res.status(200).json(summoner)
      })
    } else {
      res.status(400).json("already exists")
    }

  })
})

/**
 * R I O T A P I
 * 
 * 
 * 
 */
// Find summoner from api by name
router.get('/riot/by-name/:name', (req, res) => {
  var store = new Storage('../../rate');
  var rate = store.get("rate")
  if (rate < config.rateLimit) {
    store.put("rate", rate++)
    rp(`https://${config.regions["region"]}.api.riotgames.com/lol/summoner/v4/summoners/by-name/`+
    `${encodeURI(req.params.name)}?api_key=${config.riot}`)
      .then(data => {
        var summoner = JSON.parse(data)
        res.status(200).json(summoner)
      })
      .catch(err => {
        res.status(400).json(err)
      })
  } else {
    res.status(400).json("rate limit reached")
  }
})

// Find summoner from api by account id
router.get('/riot/by-account/:id', (req, res) => {
  rp(`https://${config.regions["region"]}.api.riotgames.com/lol/summoner/v4/summoners/by-account/`+
  `${req.params.id}?api_key=${config.riot}`)
    .then(data => {
      var summoner = JSON.parse(data)
      res.status(200).json(summoner)
    })
    .catch(err => {
      res.status(400).json(err)
    })
})

// Find summoner from api by puuid
router.get('/riot/by-puuid/:id', (req, res) => {
  rp(`https://${config.regions["region"]}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/`+
  `${req.params.id}?api_key=${config.riot}`)
    .then(data => {
      var summoner = JSON.parse(data)
      res.status(200).json(summoner)
    })
    .catch(err => {
      res.status(400).json(err)
    })
})

// Find summoner from api by summoner id
router.get('/riot/by-summoner/:id', (req, res) => {
  rp(`https://${config.regions["region"]}.api.riotgames.com/lol/summoner/v4/summoners/`+
  `${req.params.id}?api_key=${config.riot}`)
    .then(data => {
      var summoner = JSON.parse(data)
      res.status(200).json(summoner)
    })
    .catch(err => {
      res.status(400).json(err)
    })
})


module.exports = router