var express = require('express');
var router = express.Router();
var rp = require('request-promise');


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

// riot
var RiotSummoner;
var RiotLeague;
var RiotMatch;

router.use((req, res, next) => {
  region = req.headers.host.split(".")[0].replace("http://", "");
  
  //models
  SummonerProfile = require('../models/summonerProfile')(region);
  Summoner = require('../models/summoner')(region);
  Match = require('../models/match')(region);
  League = require('../models/league')(region);

  //services
  SummonerService = require('../service/summoner')(region);
  LeagueService = require('../service/league')(region);
  MatchService = require('../service/match')(region);

  //riot
  RiotSummoner = require("../riot/summoner")(region);
  RiotLeague = require('../riot/league')(region);
  RiotMatch = require('../riot/match')(region);
  next();
})

// GET SummonerProfile
router.get('/:name', (req, res) => {
  var name = req.params.name.split("").join("\\s*")
  var regex = new RegExp(`^${name}$`, "i")
  SummonerProfile.findOne({'summoner.name': regex}, (err, summonerProfile) => {
    if (err) {
      res.status(500).json(err)
    } else if (!summonerProfile) {
      res.status(400).json("not found")
    } else {
      res.status(200).json(summonerProfile)
    }
  })
})

// POST SummonerProfile
router.post('/', (req, res) => {
  var newSummonerProfile = new SummonerProfile(req.body.summonerProfile)
  SummonerProfile.findOne({summonerId: newSummonerProfile.summonerId}, (err, summonerProfile) => {
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
  SummonerProfile.findOneAndDelete({summonerId: req.params.id}, (err, summonerProfile) => {
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
  var profile = {};
  profile.matches = [];

  // GET Summoner
  // by local
  await SummonerService.getByName(name, async(summoner) => {
    if (summoner) profile.summoner = summoner;
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
    await LeagueService.getByName(name, leagues => {
      if (leagues) profile.leagues = leagues
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
    let options = {
      accountId: profile.summoner.accountId,
      query: `beginIndex=0&endIndex=10&season=${riot.season}&`
    }
    var matches = [];
    await RiotMatch.getMatches(options, list => {
      matches = list
    })
    if (matches.length > 0) {
      await matches.asyncForEach(async match => {
        await RiotMatch.byID(match.gameId, match => {
          profile.matches.push(match)
        })
      })
    }
  }
  await res.status(200).json(profile)
})
module.exports = router

