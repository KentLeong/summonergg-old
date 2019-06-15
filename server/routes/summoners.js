var express = require('express');
var router = express.Router();
var rp = require('request-promise');
var Storage = require('node-storage');

const config = require('../../config');
String.prototype.capitalize = () => {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

var Summoner;
var region;
var ip;

router.use((req, res, next) => {
  ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (ip.substr(0, 7) == "::ffff:") ip = ip.substr(7);
  region = req.headers.host.split(".")[0].replace("http://", "")
  Summoner = require('../models/summoner')(region);
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
  var name = req.params.name.split("").join("\\s*")
  var regex = new RegExp(`^${name}$`, "i")
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

// PUT summoner
router.put('/', (req, res) => {
  var updatedSummoner = new Summoner(req.body.summoner)
  Summoner.findOne({name: updatedSummoner.name}, (err, summoner) => {
    if (summoner) {
      summoner.delete();
      updatedSummoner.save((err, summoner) => {
        if (err) return res.status(400).json(err)
        res.status(200).json(summoner)
      })
    } else {
      updatedSummoner.save((err, summoner) => {
        if (err) return res.status(400).json(err)
        res.status(200).json(summoner)
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
// Find summoner from api by name
router.get('/riot/by-name/:name', (req, res) => {
  rp(`https://${config.endpoints[region]}.api.riotgames.com/lol/summoner/v4/summoners/by-name/`+
  `${encodeURI(req.params.name)}?api_key=${config.riot}`)
    .then(data => {
      var summoner = JSON.parse(data)
      res.status(200).json(summoner)
    })
    .catch(err => {
      res.status(400).json(err)
    })
})

// Find summoner from api by account id
router.get('/riot/by-account/:id', (req, res) => {
  rp(`https://${config.endpoints[region]}.api.riotgames.com/lol/summoner/v4/summoners/by-account/`+
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
  rp(`https://${config.endpoints[region]}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/`+
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
  rp(`https://${config.endpoints["region"]}.api.riotgames.com/lol/summoner/v4/summoners/`+
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

1560392919000