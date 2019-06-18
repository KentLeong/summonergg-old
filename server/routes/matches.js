var express = require('express');
var router = express.Router();
var rp = require('request-promise');
const riot = require('../riot');

Array.prototype.asyncForEach = async function(cb) {
  for(let i=0; i<this.length; i++) {
    await cb(this[i], i, this)
  }
}
var region
var Match

router.use((req, res, next) => {
  region = req.headers.host.split(".")[0].replace("http://", "")
  Match = require('../models/match')(region);
  StaticChampion = require('../models/static/champion')(region);
  next();
})

// GET all Matches (probably not a good idea to use)
router.get('/', (req, res) => {
  Match.find()
    .exec((err, matchs) => {
      if (err) return res.status(400).json(err)
      res.status(200).json(matchs)
    });
});

// get match by id
router.get('/:id', (req, res) => {
  Match.findOne({gameId: req.params.id}, (err, match) => {
    if (err) {return res.status(400).json(err);}
    if (!match) {return res.status(400).json("match does not exist");}
    res.status(200).json(match);
  })
})

// get multi matches by id
router.post('/multi/:id', (req, res) => {
/** 
  * OPTIONS***
  * champion
  * season
  * skip 
  * limit
  **/
  var options = req.body.options;
  var query = {
    participants: {
      $elemMatch: {
        currentAccountId: req.params.id
      }
    }
  }
  if (options.seasonId) query.seasonId = options.seasonId;
  if (options.championId) query.participants.$elemMatch.championId = options.championId;
  Match.find(query).skip(options.skip).limit(options.limit).exec((err, matches) => {
    if (err) {return res.status(400).json(err);}
    res.status(200).json(matches)
  })

})

router.post('/', (req, res) => {
  Match.findOne({gameId: req.body.match.gameId}, async (err, match) => {
    if (match) {return res.status(400).json("match exists");}
    const start = (async () => {
      var newMatch;
      await req.body.match.participantIdentities.asyncForEach((id, i) => {
        console.log("merging: "+(i+1))
        req.body.match.participants[i] = {...id.player, ...req.body.match.participants[i]};
      })
      await delete req.body.match.participantIdentities;
      await req.body.match.participants.asyncForEach(async (p, i) => {
        console.log("saving: "+(i+1))
        var promise = StaticChampion.findOne({key: p.championId}).select("id name").exec()
        await promise.then(champion => {
          console.log("switching: "+(i+1))
          req.body.match.participants[i].championId = champion.id;
          req.body.match.participants[i].championName = champion.name;
        })
      })
      newMatch = await new Match(req.body.match);
      await newMatch.save((err, match) => {
        console.log("save")
        if (err) {return region.status(400).json(err);}
        res.status(200).json(match)
      })
    })();
  })
})
/**
 * R I O T A P I
 * 
 * 
 * 
 */
// Find match from api by id
router.get('/riot/by-id/:id', (req, res) => {
  rp(`https://${riot.endpoints[region]}.api.riotgames.com/lol/match/v4/matches/`+
  `${req.params.id}?api_key=${riot.key}`)
    .then(data => {
      var match = JSON.parse(data)
      res.status(200).json(match)
    })
    .catch(err => {
      res.status(400).json(err)
    })
})

router.get('/riot/by-account/:id/:options', (req, res) => {
  /** 
  * OPTIONS***
  * champion
  * season
  * endTime - miliseconds 
  * beginTime - miliseconds
  * endIndex
  * beginIndex
  * 
  * format ex: "endtime=12&beginTime=0&"
  **/
  var options = req.params.options;
  if (!options) options = "";
  rp(`https://${riot.endpoints[region]}.api.riotgames.com/lol/match/v4/matchlists/by-account/`+
  `${req.params.id}?`+options+`api_key=${riot.key}`)
    .then(data => {
      var match = JSON.parse(data)
      res.status(200).json(match)
    })
    .catch(err => {
      res.status(400).json(err)
    })
})
module.exports = router