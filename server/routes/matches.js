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
  RiotMatch = require('../riot/match')(region);
  StaticChampion = require('../models/static/champion')(region);
  next();
})

router.get("/initialMatches/:id", (req, res) => {
  var options = {
    id: req.params.id,
    query: "beginIndex=0&endIndex=10&season=13&"
  }
  RiotMatch.byAccount(options, matches => {
    let main = (async function() {
      await matches.asyncForEach((match, mIndex) => {
        Match.findOne({gameId: match.gameId}, (err, data) => {
          if (data) {
            matches[mIndex] = data;
            if (10 == mIndex+1) next(req.params.id, matches);
          } else {
            RiotMatch.byID(match.gameId, async game => {
              matches[mIndex] = game;
              var newMatch = await new Match(game);
              await newMatch.save((err, match) => {
                setTimeout(()=>{
                  if (10 == mIndex+1) next(req.params.id, matches)
                }, 100)
              })
            })
          }
        })
      })
      // format for profile
      async function next(id, matches) {
        await matches.asyncForEach(async (match, i) => {
          await match.participants.some(p => {
            if (p.currentAccountId == id) {
              match.championId = p.championId;
              match.championName = p.championName;
              // calculate role;
              var role = p.timeline.role;
              var lane = p.timeline.lane;
              if (role == "DUO_CARRY") {
                match.role = "ADC"
              } else if (role == "DUO_SUPPORT") {
                match.role = "SUPPORT"
              } else if (role) {

              }
            }
            return p.currentAccountId == id
          })
        })
        res.status(200).json(matches)
      }
    })();
  })
})




// get match by id
router.get('/:id', (req, res) => {
  Match.findOne({gameId: req.params.id}, (err, match) => {
    if (err) {return res.status(400).json(err);}
    if (!match) {return res.status(400).json("match does not exist");}
    res.status(200).json(match);
  })
})

// get multi matches by id
router.get('/multi/:id', (req, res) => {
/** 
  * OPTIONS***
  * champion
  * season
  * skip 
  * limit
  **/
  var options = req.query;
  var query = {
    participants: {
      $elemMatch: {
        currentAccountId: req.params.id
      }
    }
  }
  if (options.seasonId) query.seasonId = options.seasonId;
  if (options.championId) query.participants.$elemMatch.championId = options.championId;
  Match.find(query).sort({gameCreation: 'descending'}).skip(+options.skip).limit(+options.limit).exec((err, matches) => {
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
        req.body.match.participants[i] = {...id.player, ...req.body.match.participants[i]};
      })
      await delete req.body.match.participantIdentities;
      await req.body.match.participants.asyncForEach(async (p, i) => {
        var promise = StaticChampion.findOne({key: p.championId}).select("id name").exec()
        await promise.then(champion => {
          req.body.match.participants[i].championId = champion.id;
          req.body.match.participants[i].championName = champion.name;
        })
      })
      newMatch = await new Match(req.body.match);
      await newMatch.save((err, match) => {
        if (err) {return region.status(400).json(err);}
        res.status(200).json(match)
      })
    })();
  })
})

module.exports = router