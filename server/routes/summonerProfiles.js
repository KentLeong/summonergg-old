const log = require('../config/log');

module.exports = (main, static) => {
  var express = require('express');
  var router = express.Router();
  
  
  const riot = require('../config/riot');
  String.prototype.capitalize = () => {
    return this.charAt(0).toUpperCase() + this.slice(1);
  }
  Array.prototype.asyncForEach = async function(cb) {
    for(let i=0; i<this.length; i++) {
      await cb(this[i], i, this)
    }
  }
  
  var region;
  //models
  var Summoner;
  var Match;
  var League;
  var SummonerProfile;
  
  // Services
  var SummonerService;
  var LeagueService;
  var MatchService;
  var SummonerProfileService;
  
  // riot
  var RiotSummoner;
  var RiotLeague;
  var RiotMatch;
  
  router.use((req, res, next) => {
    region = req.headers.host.split(".")[0].replace("http://", "");
    
    //models
    SummonerProfile = require('../models/summonerProfile')(main[region]);
    Summoner = require('../models/summoner')(main[region]);
    Match = require('../models/match')(main[region]);
    League = require('../models/league')(main[region]);
  
    //services
    SummonerService = require('../service/summoner')(region);
    LeagueService = require('../service/league')(region);
    MatchService = require('../service/match')(region);
    SummonerProfileService = require('../service/summonerProfile')(region);
  
    //riot
    RiotSummoner = require("../riot/summoner")(region);
    RiotLeague = require('../riot/league')(region);
    RiotMatch = require('../riot/match')(region);
    next();
  })
  
  // GET SummonerProfile
  router.get('/:name', (req, res) => {
    var language = req.query.language;
    var name = req.params.name.split("").join("\\s*")
    var regex = new RegExp(`^${name}$`, "i")
    SummonerProfile.findOne({'summoner.name': regex}, (err, summonerProfile) => {
      if (err) {
        res.status(500).json(err)
      } else if (!summonerProfile) {
        res.status(400).json("not found")
      } else {
        SummonerProfileService.translate(summonerProfile, language, profile => {
          res.status(200).json(profile)
        })
      }
    })
  })
  
  // POST SummonerProfile
  router.post('/', (req, res) => {
    var newSummonerProfile = new SummonerProfile(req.body.summonerProfile)
    SummonerProfile.findOne({'summoner.accountId': newSummonerProfile.summoner.accountId}, (err, summonerProfile) => {
      if (summonerProfile) {
        res.status(400).json("exists")
      } else {
        newSummonerProfile.save((err, summonerProfile) => {
          if (err) {
            res.status(500).json(err)
          } else {
            res.status(200).json(summonerProfile)
          }
        })
      }
    })
  })
  
  // DELETE SummonerProfile
  router.delete('/:id', (req, res) => {
    SummonerProfile.findOneAndDelete({'summoner.accountId': req.params.id}, (err, summonerProfile) => {
      if (err) {
        res.status(500).json("could not delete")
      } else {
        res.status(200).json("deleted")
      }
    })
  })
  
  // PUT summonerProfile
  router.put('/', (req, res) => {
    var summonerProfile = req.body.summonerProfile
    SummonerProfile.findOneAndUpdate({summonerId: summonerProfile.summonerId}, summonerProfile, {new: true}, (err, summonerProfile) => {
      if (err) {
        res.status(500).json(err)
      } else {
        res.status(200).json(summonerProfile)
      }
    })
  })
  
  // Generate New Profile
  router.post('/generateProfile', async (req, res) => { 
    var name = req.body.name;
    var profileFound = false;
    var profile = {};

    profile.matches = [];
  
    await SummonerProfileService.get(name, profile => {
      if (profile) profileFound = true;
    })
    
    if (profileFound) {        
      log(`Summoner Profile exists, profile generation aborted`, 'warning')
      res.status(400).json('exists')
    } else {
        // GET Summoner
      // by local
      log(`Generating ${name} profile..`, "info")
      log(`Retrieving summoner data..`, "info")
      await SummonerService.getByName(name, async(summoner) => {
        if (summoner) {
          profile.summoner = summoner
        };
      })
      if (!profile.summoner) {
        // by riot
        await RiotSummoner.getByName(name, summoner => {
          if (summoner) {
            profile.summoner = summoner;
            SummonerService.new(summoner);
          }
        })
      }
      if (!profile.summoner) {
        res.status(400).json("summoner does not exist")
      } else {
        /**
         * Finds League and Matches if Summoner is found
         */
        // GET League
        // by local
        log(`Retrieving league data..`, "info")
        await LeagueService.getByName(name, leagues => {
          if (leagues) {
            profile.leagues = leagues
          }
        })
        if (!profile.leagues) {
          // by riot
          await RiotLeague.bySummonerID(profile.summoner.id, leagues => {
            if (leagues) {
              profile.leagues = leagues;
              leagues.forEach(league => {
                LeagueService.new(league);
              })
            }
          })
        }
    
        // GET Matches
        // by local
        log('Retrieving last 10 matches from riot..', 'info')
        let options = {
          accountId: profile.summoner.accountId,
          query: `beginIndex=0&endIndex=10&season=${riot.season}&`
        }
        var matches = [];
        await RiotMatch.getMatches(options, list => {
          matches = list
        })
        if (matches.length > 0) {
          // get each match data
          await matches.asyncForEach(async data => {
            var found = false
            await MatchService.getById(data.gameId, async match => {
              if (match){
                profile.matches.push(match);
                found = true
              }
            })
            if (!found) {
              await RiotMatch.byID(data.gameId, match => {
                if (match) {
                  MatchService.new(match)
                  profile.matches.push(match);
                };
              })
            } 
          })
          // format match for summoner profile
          log(`Formating matches for profile..`, 'info')
          await SummonerProfileService.formatMatches(profile.summoner, profile.matches, matches => {
            profile.matches = matches
          })
        }
      }
      if (profile.summoner) {
        log('Saving '+profile.summoner.name+' summoner profile..', 'info')
        await SummonerProfileService.new(profile);
        if (profile.matches.length > 0) {
          await SummonerProfileService.translate(profile, "Russian", profile => {
            res.status(200).json(profile)
          })
        } else {
          res.status(200).json(profile)
        }
      } else {
        res.status(400).json("not found")
      }
    }
  })
  return router
}

