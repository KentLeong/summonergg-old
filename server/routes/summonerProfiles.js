const log = require('../config/log');
const dev = require('../config/dev');
const rate = require('../service/rate')();
const riot = require('../config/riot');
const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
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
  var MatchService;
  var SummonerProfileService;
  
  // riot
  var RiotSummoner;
  var RiotLeague;
  var RiotMatch;
  
  router.use((req, res, next) => {
    region = req.headers.host.split(".")[0].replace("http://", "");
    
    //models
    SummonerProfile = require('../models/summonerProfile')(serverList[region].main);
  
    //services
    MatchService = require('../service/match')(region);
    SummonerProfileService = require('../service/summonerProfile')(region);
    StatService = require('../service/stat')(region);

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
    summonerProfile.lastUpdated = new Date();
    SummonerProfile.findOneAndUpdate({"summoner.puuid": summonerProfile.summoner.puuid}, 
                                      summonerProfile, {new: true}, (err, profile) => {
      if (err) {
        res.status(500).json(err)
      } else {
        res.status(200).json(profile)
      }
    })
  })
  
  // Generate New Profile
  router.post('/generateProfile', async (req, res) => {

    var name = req.body.name
    var language = req.query.language;
    var profile = {};
    //find summoner profile
    await SummonerProfileService.get(name, foundProfile => {
      if (foundProfile) profile = foundProfile;
    })

    //get summoner
    await SummonerProfileService.getSummoner(profile, name, updatedProfile => {
      if (updatedProfile) profile = updatedProfile;
    })

    // check if summoner is found
    if (!profile.summoner) {
      res.status(400).json("does not exist")
    } else if(!profile.summoner.accountId) {
      res.status(400).json("couldn't update from riot")
    } else {
      var stat = false;
      var rankedGames = [];
      //get leagues
      await SummonerProfileService.getLeagues(profile, updatedProfile => {
        profile = updatedProfile;
      })

      // matches for all ranked games
      await MatchService.getAllPlayerMatch(profile.summoner.accountId, ["420", "440"], updatedSolo => {
        rankedGames = [...rankedGames, ...updatedSolo]
      })

      // get first 10 matches
      var query = {
        season: riot.season,
        beginIndex: 0,
        endIndex: 10
      }
      await SummonerProfileService.getRecentMatches(profile, query, updatedProfile => {
        profile = updatedProfile;
      })
      if (profile.matches) {
        // format profile matches
        await SummonerProfileService.formatMatches(profile.summoner, profile.matches, formatedMatches => {
          if (formatedMatches) profile.matches = formatedMatches;
        })

        // generate stats
        await SummonerProfileService.generateRecentStats(profile, updatedProfile => {
          if (updatedProfile) profile = updatedProfile
        })

        // generate champion stats
        await SummonerProfileService.generateChampions(profile, rankedGames, (updatedProfile, updatedStat) => {
          if (updatedProfile) {
            profile = updatedProfile;
            stat = updatedStat;
          }
        })
        
        // generate recent players
        await SummonerProfileService.generateRecentPlayers(profile, updatedProfile => {
          if (updatedProfile) profile = updatedProfile;
        })

        // generate recent champions and role
        await SummonerProfileService.generateRecentChampions(profile, updatedProfile => {
          if (updatedProfile) profile = updatedProfile;
        })

        // generate recent ranked matches
        await SummonerProfileService.generateRecentRanked(profile, {queues: ["420", "440"]}, updatedProfile => {
          if (updatedProfile) profile = updatedProfile;
        })
        
        // format profile match and create ranked champion stats
        await SummonerProfileService.format(profile, stat, updatedProfile => {
          profile = updatedProfile;
        })
        // save profile
        await SummonerProfileService.new(profile);

        // translate profile match
        await SummonerProfileService.translate(profile, language, translatedProfile => {
          profile = translatedProfile;
        })
      }
      
      log(`Finished creating profile for ${profile.summoner.name}`, "complete")
      res.status(200).json(profile);
    }
  })

  // Update profile
  router.put('/updateProfile', async (req, res) => {
    var puuid = req.body.puuid;
    var language = req.query.language;
    var hardReset = req.query.hardReset || false;
    var profile;
    var stat = false;
    //find summoner profile from local database by puuid
    await SummonerProfileService.byPuuid(puuid, updatedProfile => {
      profile = updatedProfile;
    })
    if (!profile) {
      res.status(400).json("doesnt exist")
    } else {
      var lastUpdated = new Date(profile.lastUpdated).getTime();
      var now = new Date().getTime();
      var seconds = Math.floor((now - lastUpdated)/1000)
      if (seconds < 30) {
        res.status(400).json("cant update too early")
      } else {
        var rankedGames = [];

        // update summoner
        await SummonerProfileService.getSummonerByPuuid(profile.summoner.puuid, summoner => {
          if (summoner) profile.summoner = summoner
        })

        // update leauges
        await SummonerProfileService.getLeagues(profile, updatedProfile => {
          if (updatedProfile) profile = updatedProfile;
        }) 

        // matches for all ranked games
        var minutes = Math.floor(seconds/60);
        var hours = Math.floor(minutes/60);
        var days = Math.floor(hours/24);
        var weeks = Math.ceil(days/7);
        if (weeks == 0) weeks = 1;
        var options = {
          weeks: weeks,
          lastUpdated: lastUpdated,
          queues: ["420", "440"]
        }
        if (days > 28) hardReset = true;
        if (hardReset) {
          await MatchService.getAllPlayerMatch(profile.summoner.accountId, options.queues, updatedGames => {
            if (updatedGames) rankedGames = [...rankedGames, ...updatedGames]
          })
          // champion stats
          await SummonerProfileService.generateChampions(profile, rankedGames, (updatedProfile, updatedStat) => {
            if (updatedProfile) {
              profile = updatedProfile;
              stat = updatedStat;
            }
          })
        } else {
          await MatchService.getUnupdatedMatches(profile.summoner.accountId, options, updatedGames => {
            if (updatedGames) rankedGames = [...rankedGames, ...updatedGames]
          })
          //champions stats
          await SummonerProfileService.updateChampions(profile, rankedGames, (updatedProfile, updatedStat) => {
            if (updatedProfile) {
              profile = updatedProfile;
              stat = updatedStat;
            }
          })
        }

        // update last 10 matches
        var query = {
          season: riot.season,
          beginIndex: 0,
          endIndex: 10
        }
  
        await SummonerProfileService.getRecentMatches(profile, query, updatedProfile => {
          profile = updatedProfile;
        })
  
        // format profile matches
        await SummonerProfileService.formatMatches(profile.summoner, profile.matches, formatedMatches => {
          if (formatedMatches) profile.matches = formatedMatches;
        })

        // generate stats
        await SummonerProfileService.generateRecentStats(profile, updatedProfile => {
          if (updatedProfile) profile = updatedProfile
        })

        // generate recent players
        await SummonerProfileService.generateRecentPlayers(profile, updatedProfile => {
          if (updatedProfile) profile = updatedProfile;
        })

        // generate recent champions and role
        await SummonerProfileService.generateRecentChampions(profile, updatedProfile => {
          if (updatedProfile) profile = updatedProfile;
        })

        // generate recent ranked matches
        await SummonerProfileService.generateRecentRanked(profile, options, updatedProfile => {
          if (updatedProfile) profile = updatedProfile;
        })

        // format profile match and create ranked champion stats
        await SummonerProfileService.format(profile, stat, updatedProfile => {
          profile = updatedProfile;
        })

        // update profile
        await SummonerProfileService.update(profile);

        // update stats
        if (hardReset) {
          await StatService.new(stats, updatedStat => {
          })
        } else {
          await StatService.update(stats, updatedStat => {
          })
        }

        // translate profile match
        await SummonerProfileService.translate(profile, language, translatedProfile => {
          profile = translatedProfile;
        })
        log('Updated profile for '+profile.summoner.name+"!", "complete")
        res.status(200).json(profile)
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

  

