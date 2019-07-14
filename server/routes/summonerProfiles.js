const log = require('../config/log');
const dev = require('../config/dev');
const rate = require('../service/rate')();

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
  // GET all SummonerProfile
  router.get('/', (req, res) => {
    SummonerProfile.find().limit(+req.query.limit).sort('-lastUpdated').select("summoner").exec((err, profiles) => {
      if (err) {
        res.status(500).json(err)
      } else if (!profiles) {
        res.status(400).json("idk what happened")
      } else {
        res.status(200).json(profiles)
      }
    })
  })

  // GET ALL puuid duplicates and delete
  router.get('/puuid-duplicates/:id', (req, res) => {
    SummonerProfile.find({'summoner.puuid': req.params.id}, (err, duplicates) => {
      if (err) {
        res.status(500).json(err)
      } else if (duplicates.length < 2) {
        res.status(200).json(duplicates.length)
      } else {
        for (var i = 1; i < duplicates.length; i++) {
          log(`deleting ${i+1} of duplicate`, 'success')
          duplicates[i].delete();
        }
        res.status(200).json(duplicates.length)
      }
    })
  })
  // GET SummonerProfile
  router.get('/:name', async (req, res) => {
    var removedSpaces = req.params.name.split(" ").join("")
    var ignoreSpacing = removedSpaces.split("").join("\\s*")
    var regex = new RegExp(`^${ignoreSpacing}$`, "i")
    SummonerProfile.findOne({'summoner.name': regex}, (err, profile) => {
      if (err) {
        res.status(500).json(err)
      } else if (!profile) {
        res.status(400).json("not found")
      } else {
        res.status(200).json(profile)
      }
    })
  })
  
  // GET SummonerProfile by id
  router.get('/by-id/:id', (req, res) => {
    SummonerProfile.findOne({'summoner.id': req.params.id}, (err, profile) => {
      if (err) {
        res.status(500).json(err)
      } else if (!profile) {
        res.status(400).json("not found")
      } else {
        res.status(200).json(profile)
      }
    })
  })

  // POST SummonerProfile
  router.post('/', (req, res) => {
    var newSummonerProfile = new SummonerProfile(req.body.summonerProfile)
    SummonerProfile.findOne({summoner: newSummonerProfile.summoner}, (err, summonerProfile) => {
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
    SummonerProfile.findOne({summonerId: summonerProfile.summonerId}, (err, profile) => {
      if (err) {
        res.status(500).json(err)
      } else {
        profile.summoner = "";
        profile.matches = "";
        profile.leagues = "";
        profile.lastUpdated = "";
        profile.save((err, profile) => {
          profile.summoner = summonerProfile.summoner;
          profile.matches = summonerProfile.matches;
          profile.leagues = summonerProfile.leagues;
          profile.lastUpdated = new Date();
          profile.save((err, profile) => {
            if (err) {
              res.status(500).json("failed")
            } else {
              res.status(200).json(profile)
            }
          })
        })
      }
    })
  })
  
  // Generate New Profile
  router.post('/generateProfile', async (req, res) => {
    //for api rates
    var totalUsed = 0;
    var max = 13;
    var rateAvailable = true;

    var name = req.body.name
    var profile = {};

    await rate.remainingRate((currentRate, second, minute) => {
      if (second < max || minute < max) {
        rateAvailable = false;
        log(`Riot rate used up, please wait`, "warning")
      }
    })

    if (!rateAvailable) {
      res.status(400).json("riot rate used up");
    } else {
      //find summoner profile
      await SummonerProfileService.get(name, foundProfile => {
        if (foundProfile) profile = foundProfile;
      })

      //get summoner
      await SummonerProfileService.getSummoner(profile, name, (updatedProfile, used) => {
        if (updatedProfile) profile = updatedProfile;
        totalUsed += used;
      })

      // check if summoner is found
      if (!profile.summoner) {
        res.status(400).json("does not exist")
      } else if(!profile.summoner.accountId) {
        res.status(400).json("couldn't update from riot")
      } else {
        //get leagues
        await SummonerProfileService.getLeagues(profile, (updatedProfile, used) => {
          totalUsed += used;
          profile = updatedProfile;
        })

        // get first 10 matches
        var query = "beginIndex=0&endIndex=10&season="+riot.season+"&"
        await SummonerProfileService.getMatches(profile, query, (updatedProfile, used) => {
          totalUsed += used;
          profile = updatedProfile;
        })

        // format profile matches
        await SummonerProfileService.formatMatches(profile.summoner, profile.matches, formatedMatches => {
          if (formatedMatches) profile.matches = formatedMatches;
        })

        // translate profile match champions
        await SummonerProfileService.translate(profile, "English", updatedProfile => {
          if (updatedProfile) profile = updatedProfile
        })
        
        // save profile match
        SummonerProfileService.formatAndSave(profile)
        // rate.rateUsed(totalUsed);
        log(`Finished creating profile for ${profile.summoner.name}`, "complete")
        res.status(200).json(profile);
      }
    }
  })

  // retrieve matches
  router.get('/retrieveMatches/:accountId', async (req, res) => {
    var options = {
      skip: req.query.skip,
      limit: req.query.limit,
      season: req.query.season
    }
    var matches = [];
    var summoner = {};

    if (req.query.champion) options.champion = req.query.champion;

    await SummonerService.getByAccount(req.params.accountId, summonerFound => {
      summoner = summonerFound
    })
    await MatchService.getByAccount(req.params.accountId, options, newMatches => {
      matches = newMatches
    })

    await SummonerProfileService.formatMatches(summoner, matches, formatedMatches => {
      matches = formatedMatches;
    })
    res.status(200).json(matches)
  })
  return router
}

  

