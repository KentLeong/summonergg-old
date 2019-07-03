var express = require('express');
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
  StaticChampion = require('../models/static/champion')(language);
  DdragonChampion = require('../ddragon/champion')(language);
  next();
})

router.post('/update/champions', async (req, res) => {
  var champions = [];
  await DdragonChampion.getList(list => {
    champions = list
  })
  await champions.asyncForEach(champion => {
    StaticChampion.findOne({name: champion.name}, (err, old) => {
      if (old) old.delete();
      var newChampion = new StaticChampion(champion)
      newChampion.save((err, champion)=> {
        console.log(`${champion.name} has been saved`)
      });
    })
  })
  res.status(200).json(champions)
})

router.get('/champion/name-by-key/:key', (req, res) => {
  StaticChampion.findOne({key: req.params.key}).select("id name").exec((err, champion) => {
    if (err) return res.status(400).json(err);
    res.status(200).json(champion);
  })
})

module.exports = router


// rp("http://ddragon.leagueoflegends.com/cdn/"+riot.ver+"/data/en_US/champion.json ")
// .then(data=>{
//   var championList = JSON.parse(data).data;
//   Object.keys(championList).forEach(champion => {
//     rp("http://ddragon.leagueoflegends.com/cdn/"+riot.ver+"/data/en_US/champion/"+champion+".json")
//     .then(data=>{
//       var championData = JSON.parse(data).data[champion];
//       StaticChampion.findOne({id: championData.id}, (err, champion) => {
//         if (err) return res.status(400).json(err);
//         if (champion) champion.remove();
//         var newStaticChampion = new StaticChampion(championData)
//         newStaticChampion.save((err, summoner) => {
//           if (err) return res.status(400).json(err)
//         })
//       })
//       // var file = fs.createWriteStream("./src/assets/champion-squares/"+champion+".png");
//       // http.get("http://ddragon.leagueoflegends.com/cdn/"+riot.ver+"/img/champion/"+champion+".png", function(response) {
//       //   response.pipe(file);
//       // });
//     })
//     .catch(err => {
//       return res.status(400).json(err)
//     })
//   })
// })
// .catch(err => {
//   return res.status(400).json(err)
// })