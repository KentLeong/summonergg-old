
const region = "na"
const rate = require('./server/service/rate')();
const axios = require('axios');
const MatchService = require('./server/service/match')(region);
const RiotMatch = require('./server/riot/match')(region);
const static = require('./server/static/champions.json')
const RiotLeague = require('./server/riot/league')(region);
const SummonerProfileService = require('./server/service/summonerProfile')(region);
const localClient = require('./server/config/localClient')(region);
const log = require('./server/config/log');
const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
Array.prototype.asyncForEach = async function(cb) {
  for(let i=0; i<this.length; i++) {
    await cb(this[i], i, this)
  }
}


var main = async function() {
  var matches = [];
  var leagueList = [];
  var queues = ["RANKED_SOLO_5x5"];
  var tiers = ["DIAMOND"];
  var divisions = ["IV"];
  // var queues = ["RANKED_SOLO_5x5", "RANKED_FLEX_TT", "RANKED_FLEX_SR"];
  // var tiers = ["DIAMOND", "PLATINUM", "GOLD", "SILVER", "BRONZE", "IRON"];
  // var divisions = ["I", "II", "III", "IV"];
  
  await queues.asyncForEach(async queue => {
    // await RiotLeague.retrieveChallenger(queue, async challengerList => {
    //   var list = challengerList['entries'];
    //   await list.asyncForEach(l => {
    //     l.queueType = challengerList['queue'];
    //     l.leagueId = challengerList['leagueId'];
    //     l.tier = challengerList['tier'];
    //   })
    //   if (challengerList) leagueList = [...leagueList, ...list];
    // })
    // await RiotLeague.retrieveGrandMaster(queue, async grandmasterList => {
    //   var list = grandmasterList['entries'];
    //   await list.asyncForEach(l => {
    //     l.queueType = grandmasterList['queue'];
    //     l.leagueId = grandmasterList['leagueId'];
    //     l.tier = grandmasterList['tier'];
    //   })
    //   if (grandmasterList) leagueList = [...leagueList, ...list];
    // })
    // await RiotLeague.retrieveMaster(queue, async masterList => {
    //   var list = masterList['entries']
    //   await list.asyncForEach(l => {
    //     l.queueType = masterList['queue'];
    //     l.leagueId = masterList['leagueId'];
    //     l.tier = masterList['tier'];
    //   })
    //   if (masterList) leagueList = [...leagueList, ...list];
    // })

    await tiers.asyncForEach(async tier => {
      await divisions.asyncForEach(async div => {
        let options = {
          queue: queue,
          tier: tier,
          division: div,
          page: 1
        }
        do {
          var done = false;
          await RiotLeague.retrieveDivision(options, list => {
            if (list) leagueList = [...leagueList, ...list];
            if (list.length == 0) {
              done = true;
            } else {
              options.page++
            }
          })
          await waitFor(60)
        } while (!done)
      })
    })
  })


  
  // use for debuging, because executes by line

  await leagueList.asyncForEach(async league => {
    var found = false;
    log(`Searching for ${league.summonerName}..`, 'info')
    await SummonerProfileService.getById(league.summonerId, async profile => {
      if (profile) found = true;
    })
    if (!found) {
      try {
        rate.rateUsed(13)
        await waitFor(250)
        var res = localClient.post('/summonerProfiles/generateProfile', {name: league.summonerName})
        log("Generated profile for "+league.summonerName+"!", 'success')
      } catch(err) {
        log(`Could not generate profile for ${league.summonerName}`, 'error')
      }
    }
  })


  // // runs fast but hard to debug (also riot will blacklist cuase it will exceed rate)

  // await leagueList.asyncForEach(async league => {
  //   log(`Searching for ${league.summonerName}..`, 'info')
  //   await SummonerProfileService.getById(league.summonerId, async profile => {
  //     if (!profile) {
  //       try {
  //         var res = await localClient.post('/summonerProfiles/generateProfile', {name: league.summonerName})
  //         log("Generated profile for "+league.summonerName+"!", 'success')
  //       } catch(err) {
  //         log(`Could not generate profile for ${league.summonerName}`, 'error')
  //       }
  //     }
  //   })
  // })

  // console.log(leagueList[0])
}

main();