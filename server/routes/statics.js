var express = require('express');
module.exports = (main, static) => {
  var router = express.Router();
  
  Array.prototype.asyncForEach = async function(cb) {
    for(let i=0; i<this.length; i++) {
      await cb(this[i], i, this)
    }
  }
  
  var language
  
  // models
  var StaticChampion
  // services
  var DdragonChampion
  
  router.use((req, res, next) => {
    language = req.query.language
    StaticChampion = require('../models/static/champion')(static[language]);
    DdragonChampion = require('../ddragon/champion')(language);
    next();
  })
  
  router.post('/update/championList', async (req, res) => {
    var champions = [];
    console.log(`${language} champion is being updated...`)
    await DdragonChampion.getList(list => {
      champions = list
    })
    await champions.asyncForEach(async champion => {
      await StaticChampion.findOne({name: champion.name}, (err, old) => {
        if (old) old.delete();
        var newChampion = new StaticChampion(champion)
        newChampion.save((err, champion)=> {
          console.log(`${champion.name} has been saved`)
        });
      })
    })
    res.status(200).json(champions)
  })
  
  router.get('/champion/key/:key', (req, res) => {
    StaticChampion.findOne({key: req.params.key}).exec((err, champion) => {
      if (err) return res.status(400).json(err);
      res.status(200).json(champion);
    })
  })
  return router
}