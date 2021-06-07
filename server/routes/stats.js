module.exports = (serverList) => {
  var express = require('express');
  var router = express.Router();
  
  
  const riot = require('../config/riot');
  
  router.use((req, res, next) => {
    ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip.substr(0, 7) == "::ffff:") ip = ip.substr(7);
    region = req.headers.host.split(".")[0].replace("http://", "")
    Stat = require('../models/stat')(serverList[region].main);
    next();
  })
  
  // GET by puuid
  router.get('/:id', (req, res) => {
    Stat.findOne({puuid: req.params.id}, (err, stat) => {
      if (err) {
        res.status(500).json(err)
      } else if (!stat) {
        res.status(200).json("not found")
      } else  {
        res.status(200).json(stat)
      }
    })
  })

  // POST Stat
  router.post('/', (req, res) => {
    var newStat = new Stat(req.body.stat)
    newStat.lastUpdated = new Date();
    Stat.findOneAndUpdate({puuid: newStat.puuid}, newStat, {new: true, upsert: true}, (err, stat)=> {
      if (err) {
        res.status(500).json(err)
      } else {
        res.status(200).json(stat)
      }
    })
  })

  // PUT stat
  router.put('/', (req, res) => {
    var updatedStat = req.body.stat;
    updatedStat.lastUpdated = new Date();
    Stat.findOneAndUpdate({puuid: updatedStat.puuid}, updatedStat, {new: true}, (err, stat)=> {
      if (err) return res.status(500).json(err);
      res.status(200).json(stat)
    })
  })

  return router
}
