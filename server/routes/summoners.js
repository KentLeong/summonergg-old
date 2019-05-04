var express = require('express');
var router = express.Router();
var rp = require('request-promise');
var Summoner = require('../models/summoner');
const config = require('../../config');
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

// GET all Summoners (probably not a good idea to use)
router.get('/', (req, res) => {
  Summoner.find()
    .exec((err, summoners) => {
      if (err) return res.status(400).json(err)
      res.status(200).json(summoners)
    });
});

// GET summoner
router.get('/:summoner', (req, res) => {
  var regex = new RegExp(`^${req.params.name}$`, "i")
  Summoner.findOne({name: regex}, (err, summoner) => {
    if (err) return res.status(400).json(err)
    res.status(200).json(summoner)
  }) 
})

// POST new summoner
router.post('/', (req, res) => {
  var newSummoner = new Summoner(req.body.summoner)
  newSummoner.save((err, summoner) => {
    if (err) return res.status(400).json(err)
    res.status(200).json(summoner)
  })

})
module.exports = router