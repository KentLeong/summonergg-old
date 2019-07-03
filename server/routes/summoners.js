var express = require('express');
var router = express.Router();
var rp = require('request-promise');

const riot = require('../config/riot');
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
// GET Summoner
router.get('/:id', (req, res) => {
  Summoner.findOne({id: req.params.id}, (err, summoner) => {
    if (err) {
      res.status(500).json(err)
    } else {
      res.status(200).json(summoner)
    }
  })
})

// POST Summoner
router.post('/', (req, res) => {
  var newSummoner = new Summoner(req.body.summoner)
  Summoner.findOne({id: newSummoner.id}, (err, summoner) => {
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

// DELETE Summoner
router.delete('/:id', (req, res) => {
  Summoner.findOneAndDelete({id: req.params.id}, (err, summoner) => {
    if (err) {
      res.status(500).json("could not delete")
    } else {
      res.status(200).json("deleted")
    }
  })
})

// PUT summoner
router.put('/', (req, res) => {
  var summoner = req.body.summoner
  Summoner.findOneAndUpdate({id: summoner.id}, summoner, {new: true}, (err, summoner) => {
    if (err) {
      res.status(500).json(err)
    } else {
      res.status(200).json(summoner)
    }
  })
})


// GET by Name
router.get('/name/:name', (req, res) => {
  var name = req.params.name.split("").join("\\s*")
  var regex = new RegExp(`^${name}$`, "i")
  Summoner.findOne({name: regex}, (err, summoner) => {
    if (err) {
      res.status(500).json(err)
    } else if (!summoner) {
      res.status(400).json("not found")
    } else {
      res.status(200).json(summoner)
    }
  })
})
module.exports = router