module.exports = (main, static) => {
  var express = require('express');
  var router = express.Router();
  const riot = require('../config/riot');
  
  Array.prototype.asyncForEach = async function(cb) {
    for(let i=0; i<this.length; i++) {
      await cb(this[i], i, this)
    }
  }
  var region
  var Match
  
  router.use((req, res, next) => {
    region = req.headers.host.split(".")[0].replace("http://", "")
    Match = require('../models/match')(main[region]);
    RiotMatch = require('../riot/match')(main[region]);
    next();
  })
  
  // GET Match
  router.get('/:id', (req, res) => {
    Match.findOne({gameId: req.params.id}, (err, match) => {
      if (err) {
        res.status(500).json(err)
      } else {
        res.status(200).json(match)
      }
    })
  })
  
  // POST Match
  router.post('/', (req, res) => {
    var newMatch = new Match(req.body.match)
    Match.findOne({gameId: newMatch.gameId}, (err, match) => {
      if (match) {
        res.status(400).json("exists")
      } else {
        newMatch.save((err, match) => {
          if (err) {
            res.status(500).json(err)
          } else {
            res.status(200).json(match)
          }
        })
      }
    })
  })
  
  // DELETE Match
  router.delete('/:id', (req, res) => {
    Match.findOneAndDelete({matchId: req.params.id}, (err, match) => {
      if (err) {
        res.status(500).json("could not delete")
      } else {
        res.status(200).json("deleted")
      }
    })
  })
  
  // PUT match
  router.put('/', (req, res) => {
    var match = req.body.match
    Match.findOneAndUpdate({matchId: match.matchId}, match, {new: true}, (err, match) => {
      if (err) {
        res.status(500).json(err)
      } else {
        res.status(200).json(match)
      }
    })
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
            var blueTeamWin
            if (match.teams[0].win == "Win") {
              blueTeamWin = true;
            } else {
              blueTeamWin = false;
            }
            await match.participants.some(p => {
              if (p.currentAccountId == id) {
                //calc game outcome
                if (p.teamId == 100) {
                  if (blueTeamWin) {
                    match.victory = "Victory";
                  } else {
                    match.victory = "Defeat";
                  }
                } else {
                  if (blueTeamWin) {
                    match.victory = "Defeat";
                  } else {
                    match.victory = "Victory";
                  }
                }
                match.championId = p.championId;
                match.championName = p.championName;
                // calculate role
                var role = p.timeline.role;
                var lane = p.timeline.lane;
                if (lane == "MIDDLE") {
                  match.role = "middle"
                } else if (lane == "JUNGLE") {
                  match.role = "jungle"
                } else if (lane == "TOP") {
                  if (role == "DUO_SUPPORT") {
                    match.role = "support"
                  } else {
                    match.role = "top"
                  }
                } else if (lane == "BOTTOM") {
                  if (role == "DUO_SUPPORT") {
                    match.role = "support"
                  } else {
                    match.role = "bottom"
                  }
                }
                // spells and perks
                match.spell1 = p.spell1Id
                match.spell2 = p.spell2Id
                match.perk1 = p.stats.perkPrimaryStyle
                match.perk2 = p.stats.perkSubStyle
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
  
  return router
}