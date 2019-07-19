module.exports = (serverList) => {
  var express = require('express');
  var router = express.Router();
  
  
  const riot = require('../config/riot');
  
  router.use((req, res, next) => {
    ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip.substr(0, 7) == "::ffff:") ip = ip.substr(7);
    region = req.headers.host.split(".")[0].replace("http://", "")
    Stat = require('../models/stat')(serverList[region]);
    next();
  })
  
  // GET League
  router.get('/:id', (req, res) => {
    Stat.findOne({puuid: req.params.id}, (err, stat) => {
      if (err) {
        res.status(500).json(err)
      } else if (!stat) {
        res.status(200).json("not found")
      } else {
        res.status(200).json(stat)
      }
    })
  })

  // POST Stat
  router.post('/', (req, res) => {
    var newStat = new Stat(req.body.stat)
    Stat.findOne({puuid: newStat.puuid}, (err, stat) => {
      if (stat) {
        res.status(400).json("exists")
      } else {
        newStat.lastUpdated = new Date();
        newStat.save((err, stat) => {
          if (err) {
            res.status(500).json(err)
          } else {
            res.status(200).json(stat)
          }
        })
      }
    })
  })

  return router
}
