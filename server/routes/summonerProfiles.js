const log = require('../config/log');
const dev = require('../config/dev');
const rate = require('../service/rate')();
const riot = require('../config/riot');
module.exports = (serverList) => {
  var express = require('express');
  var router = express.Router();
  
  
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
    SummonerProfile = require('../models/summonerProfile')(serverList[region]);
  
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

  // GET SummonerProfile by PUUID
  router.get('/by-puuid/:id', (req, res) => {
    SummonerProfile.findOne({'summoner.puuid': req.params.id}, (err, profile) => {
      if (err) {
        res.status(500).json(err)
      } else if (!profile) {
        res.status(400).json("does not exist")
      } else {
        res.status(200).json(profile)
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
        SummonerProfileService.translate(profile, req.query.language, translatedProfile => {
          res.status(200).json(translatedProfile)
        })
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
        profile.stats = "";
        profile.save((err, profile) => {
          profile.summoner = summonerProfile.summoner;
          profile.matches = summonerProfile.matches;
          profile.leagues = summonerProfile.leagues;
          profile.stats = summonerProfile.stats;
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
    var rateAvailable = true;

    var name = req.body.name
    var language = req.query.language;
    var profile = {};

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
      })

      // check if summoner is found
      if (!profile.summoner) {
        res.status(400).json("does not exist")
      } else if(!profile.summoner.accountId) {
        res.status(400).json("couldn't update from riot")
      } else {
        var stat = false;
        //get leagues
        await SummonerProfileService.getLeagues(profile, (updatedProfile, used) => {
          profile = updatedProfile;
        })

        // matches for all ranked games
        await MatchService.getAllPlayerMatch(profile.summoner.accountId, "420")
        await MatchService.getAllPlayerMatch(profile.summoner.accountId, "440")
        await MatchService.getAllPlayerMatch(profile.summoner.accountId, "470")

        // get first 10 matches
        var query = {
          season: riot.season,
          beginIndex: 0,
          endIndex: 10
        }
        await SummonerProfileService.getMatches(profile, query, (updatedProfile, used) => {
          profile = updatedProfile;
        })
        // format profile matches
        await SummonerProfileService.formatMatches(profile.summoner, profile.matches, formatedMatches => {
          if (formatedMatches) profile.matches = formatedMatches;
        })

        // generate stats
        await SummonerProfileService.generateStats(profile, updatedProfile => {
          if (updatedProfile) profile = updatedProfile
        })

        // generate champions
        await SummonerProfileService.generateChampions(profile, riot.season, (updatedProfile, updatedStat) => {
          if (updatedProfile) {
            profile = updatedProfile;
            stat = updatedStat;
          }
        })

        // save profile match
        await SummonerProfileService.format(profile, stat, updatedProfile => {
          profile = updatedProfile;
        })

        await SummonerProfileService.new(profile);

        // translate profile match
        await SummonerProfileService.translate(profile, language, translatedProfile => {
          profile = translatedProfile;
        })
        log(`Finished creating profile for ${profile.summoner.name}`, "complete")
        res.status(200).json(profile);
      }
    }
  })

  // Update profile
  router.put('/updateProfile', async (req, res) => {
    var puuid = req.body.puuid;
    var language = req.query.language;
    var profile;
    //for api rates
    var totalUsed = 0;
    var max = 13;
    var rateAvailable = true;

    await rate.reserverListingRate((currentRate, second, minute) => {
      if (second < max || minute < max) {
        rateAvailable = false;
        log(`Riot rate used up, please wait`, "warning")
      }
    })
    if (!rateAvailable) {
      res.status(400).json("riot rate used up")
    } else {
      var stat = false;
      //find summoner profile from local database by puuid
      await SummonerProfileService.byPuuid(puuid, updatedProfile => {
        profile = updatedProfile;
      })

      // get summoner by puuid from riot and set summoner
      await RiotSummoner.getByPUUID(puuid, foundSummoner => {
        totalUsed++
        if (foundSummoner) profile.summoner = foundSummoner;
      })

      // get leagues from riot with updated summoner and set leagues
      var queues = {
        RANKED_SOLO_5x5: "solo",
        RANKED_FLEX_SR: "flexSR",
        RANKED_FLEX_TT: "flexTT"
      }
      await RiotLeague.bySummonerId(profile.summoner.id, async leagues => {
        totalUsed++
        if (leagues.length > 0) {
          await leagues.asyncForEach(league => {
            profile.leagues[queues[league.queueType]] = league
          })
        }
      })

      // update last 10 matches
        var query = {
          season: riot.season,
          beginIndex: 0,
          endIndex: 10
        }
      await SummonerProfileService.getMatches(profile, query, (updatedProfile, used) => {
        totalUsed += used;
        profile = updatedProfile;
      })

      // format profile matches
      await SummonerProfileService.formatMatches(profile.summoner, profile.matches, formatedMatches => {
        if (formatedMatches) profile.matches = formatedMatches;
      })

      // generate stats
      await SummonerProfileService.generateStats(profile, updatedProfile => {
        if (updatedProfile) profile = updatedProfile
      })

      // update profile match
      await SummonerProfileService.format(profile, stat, updatedProfile => {
        profile = updatedProfile;
      })

      await SummonerProfileService.update(profile)
      // translate profile match
      await SummonerProfileService.translate(profile, language, translatedProfile => {
        profile = translatedProfile;
      })
      rate.rateUsed(totalUsed);
      log(`Finished Updating profile: ${profile.summoner.name}`, 'complete')
      res.status(200).json(profile)
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

  

