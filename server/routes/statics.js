var express = require('express');
var router = express.Router();
var rp = require('request-promise');
var StaticChampion = require('../models/static/champion');

const riot = require('../riot');
const http = require('http');
const fs = require('fs');


router.post('/update/profile-icons', (req, res) => {
  rp("http://ddragon.leagueoflegends.com/cdn/"+riot.ver+"/data/en_US/profileicon.json")
    .then(data=>{
      var iconList = JSON.parse(data);
      Object.keys(iconList.data).forEach((key, i) => {
        setTimeout(()=>{
          var file = fs.createWriteStream("./src/assets/profile-icons/"+key+".png");
          http.get("http://ddragon.leagueoflegends.com/cdn/"+riot.ver+"/img/profileicon/"+key+".png", function(response) {
            response.pipe(file);
          });
        }, 200*i)
      })
    })
    .catch(err => {
      res.status(400).json(err)
    })
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
          var file = fs.createWriteStream("./src/assets/champion-squares/"+champion+".png");
          http.get("http://ddragon.leagueoflegends.com/cdn/"+riot.ver+"/img/champion/"+champion+".png", function(response) {
            response.pipe(file);
          });
        })
        .catch(err => {
          res.status(400).json(err)
        })
      })
    })
    .catch(err => {
      res.status(400).json(err)
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

router.post('/update/items', (req, res) => {
    rp("http://ddragon.leagueoflegends.com/cdn/"+riot.ver+"/data/en_US/item.json")
    .then(data=>{
      var items = JSON.parse(data);
      res.status(200).json(items)
    })
    .catch(err => {
      res.status(400).json(err)
    })
})

router.post('/update/summoners', (req, res) => {
  rp("http://ddragon.leagueoflegends.com/cdn/"+riot.ver+"/data/en_US/summoner.json")
  .then(data=>{
    var iconList = JSON.parse(data);
    res.status(200).json(iconList)
  })
  .catch(err => {
    res.status(400).json(err)
  })
})

router.post('/test', (req, res) => {
  const file = fs.createWriteStream("./src/assets/profile-icons/1232.png");
  http.get("http://ddragon.leagueoflegends.com/cdn/9.11.1/img/profileicon/1232.png", function(response) {
    response.pipe(file);
    res.status(200).json(file)
  });
})
module.exports = router