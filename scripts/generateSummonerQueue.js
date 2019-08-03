const region = ("na")
const Queue = require('../server/service/queue')(region);
const MatchService = require('../server/service/match')(region);
const SummonerProfileService = require("../server/service/summonerProfile")(region);
const RiotSummoner = require("../server/riot/summoner")(region);
const RiotLeague = require("../server/riot/league")(region);
const log = require('../server/config/log');
const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
Array.prototype.asyncForEach = async function(cb) {
  for(let i=0; i<this.length; i++) {
    await cb(this[i], i, this)
  }
}


var main = async () => {  
  var queue = "RANKED_SOLO_5x5";
  // var tiers = ["DIAMOND", "PLATINUM", "GOLD", "SILVER", "BRONZE", "IRON"];
  // var divisions = ["I", "II", "III", "IV"];
  var tiers = ["DIAMOND"];
  var divisions = ["I", "II", "III", "IV"];
  
  var leagueList = [];
  
  await RiotLeague.retrieveChallenger(queue, async challengerList => {
    var list = challengerList['entries'];
    await list.asyncForEach(l => {
      l.queueType = challengerList['queue'];
      l.leagueId = challengerList['leagueId'];
      l.tier = challengerList['tier'];
    })
    if (challengerList) leagueList = [...leagueList, ...list];
  })
  await RiotLeague.retrieveGrandMaster(queue, async grandmasterList => {
    var list = grandmasterList['entries'];
    await list.asyncForEach(l => {
      l.queueType = grandmasterList['queue'];
      l.leagueId = grandmasterList['leagueId'];
      l.tier = grandmasterList['tier'];
    })
    if (grandmasterList) leagueList = [...leagueList, ...list];
  })
  await RiotLeague.retrieveMaster(queue, async masterList => {
    var list = masterList['entries']
    await list.asyncForEach(l => {
      l.queueType = masterList['queue'];
      l.leagueId = masterList['leagueId'];
      l.tier = masterList['tier'];
    })
    if (masterList) leagueList = [...leagueList, ...list];
  })
  await leagueList.asyncForEach(async league => {
    var found = false;
    await SummonerProfileService.getById(league.summonerId, summoner => {
      if (summoner) {
        log(`${league.summonerName} already exists, going next`, "info");
        found = true;
      } else {
        log(`${league.summonerName} does not exist, adding to the queue..`, 'info')
      }
    })
    if (!found) {
      var summoner = {
        summonerId: league.summonerId,
        name: league.summonerName
      }
      await Queue.newSummoner(summoner);
    }
  })
  leagueList = [];

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
    await leagueList.asyncForEach(async league => {
      var found = false;
      await SummonerProfileService.getById(league.summonerId, summoner => {
        if (summoner) {
          log(`${summoner.name} already exists, going next`, "info");
          found = true;
        } else {
          log(`${league.summonerName} does not exist, adding to the queue..`, 'info')
        }
      })
      if (!found) {
        var summoner = {
          summonerId: league.summonerId,
          name: league.summonerName
        }
        await Queue.newSummoner(summoner);
      }
    })
    // leagueList = [];
  })
}

main();