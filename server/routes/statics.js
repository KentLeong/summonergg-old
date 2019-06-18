var express = require('express');
var router = express.Router();
var rp = require('request-promise');


const riot = require('../riot');
const http = require('http');
const fs = require('fs');

var StaticChampion

router.use((req, res, next) => {
  region = req.headers.host.split(".")[0].replace("http://", "")
  StaticChampion = require('../models/static/champion')(region);
  next();
})

router.post('/update/champions', (req, res) => {
    rp("http://ddragon.leagueoflegends.com/cdn/"+riot.ver+"/data/en_US/champion.json ")
    .then(data=>{
      var championList = JSON.parse(data).data;
      Object.keys(championList).forEach(champion => {
        rp("http://ddragon.leagueoflegends.com/cdn/"+riot.ver+"/data/en_US/champion/"+champion+".json")
        .then(data=>{
          var championData = JSON.parse(data).data[champion];
          StaticChampion.findOne({id: championData.id}, (err, champion) => {
            if (err) return res.status(400).json(err);
            if (champion) champion.remove();
            var newStaticChampion = new StaticChampion(championData)
            newStaticChampion.save((err, summoner) => {
              if (err) return res.status(400).json(err)
            })
          })
          // var file = fs.createWriteStream("./src/assets/champion-squares/"+champion+".png");
          // http.get("http://ddragon.leagueoflegends.com/cdn/"+riot.ver+"/img/champion/"+champion+".png", function(response) {
          //   response.pipe(file);
          // });
        })
        .catch(err => {
          return res.status(400).json(err)
        })
      })
    })
    .catch(err => {
      return res.status(400).json(err)
    })
})

router.post('/update/champions/:champion', (req, res) => {
    rp("http://ddragon.leagueoflegends.com/cdn/"+riot.ver+"/data/en_US/champion/"+req.params.champion+".json")
    .then(data=>{
      var champion = JSON.parse(data);
      res.status(200).json(champion)
    })
    .catch(err => {
      res.status(400).json(err)
    })
})

router.get('/champion/name-by-key/:key', (req, res) => {
  StaticChampion.findOne({key: req.params.key}).select("id name").exec((err, champion) => {
    if (err) return res.status(400).json(err);
    res.status(200).json(champion);
  })
})

module.exports = router