const region = "na"
const rate = require('../server/service/rate')();
const riot = require('../server/config/riot');
const MatchService = require('../server/service/match')(region);
const RiotMatch = require('../server/riot/match')(region);
const static = require('../server/static/champions.json')
const RiotLeague = require('../server/riot/league')(region);
const RiotSummoner = require('../server/riot/summoner')(region);
const SummonerProfileService = require('../server/service/summonerProfile')(region);
const localClient = require('../server/config/localClient')(region);
const log = require('../server/config/log');
const Queue = require('../server/service/queue')(region);

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

Array.prototype.asyncForEach = async function(cb) {
  for(let i=0; i<this.length; i++) {
    await cb(this[i], i, this)
  }
}

var main = async function() {
  var done = false;
  do {
    var summonerList = [];
    await Queue.getSummoners(summoners => {
      if (summoners.length == 0) {
        done = true;
      } else {
        summonerList = summoners;
      }
    })
    await summonerList.asyncForEach(async summoner => {
      var found = false;
      var name = summoner.name;
      await SummonerProfileService.getById(summoner.summonerId, async profile => {
        if (profile) {
          found = true;
          log(`Profile ${name} already exists, going next..`, 'warning')
        } else {
          log(`Could not find a profile for ${name}, creating..`, 'info')
        }
      })
      if (!found) {
        try {
          var res = await localClient.post('/summonerProfiles/generateProfile?language=English', {name: name});
          log("Generated profile for "+name, 'success')
        } catch(err) {
          log(`Could not generate profile for ${name}`, 'error')
        }
      }
      await Queue.deleteSummoner(summoner.summonerId);
    })
  } while (!done)
}


main();