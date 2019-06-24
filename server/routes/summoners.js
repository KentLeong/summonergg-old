var express = require('express');
var router = express.Router();
var rp = require('request-promise');

const riot = require('../riot');
String.prototype.capitalize = () => {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

var Summoner;
var region;
var ip;

router.use((req, res, next) => {
  region = req.headers.host.split(".")[0].replace("http://", "")
  Summoner = require('../models/summoner')(region);
  RiotSummoner = require('../riot/summoner')(region);
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
    if (summoner) {
      return res.status(200).json(summoner)
    } else {
      RiotSummoner.getByName(req.params.name, summoner => {
        if (summoner) {
          var newSummoner = new Summoner(summoner)
          newSummoner.save((err, summoner) => {
            if (err) return res.status(400).json(err)
            res.status(200).json(summoner)
          })
        } else {
          res.status(400).json("not found")
        }
      });
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

module.exports = router