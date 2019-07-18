const region = "na"
const rate = require('../server/service/rate')();
const riot = require('../server/config/riot');
const axios = require('axios');
const MatchService = require('../server/service/match')(region);
const RiotMatch = require('../server/riot/match')(region);
const static = require('../server/static/champions.json')
const RiotLeague = require('../server/riot/league')(region);
const SummonerProfileService = require('../server/service/summonerProfile')(region);
const localClient = require('../server/config/localClient')(region);
const log = require('../server/config/log');
const fs = require('fs');
const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

Array.prototype.asyncForEach = async function(cb) {
  for(let i=0; i<this.length; i++) {
    await cb(this[i], i, this)
  }
}

var main = async function() {
  var ranks = {
    HIGH: [],
    DIAMOND: [],
    PLATINUM: [],
    GOLD: [],
    SILVER: [],
    BRONZE: [],
    IRON: []
  }  
  await Object.keys(ranks).asyncForEach(async rank => {
    fs.readFile(__dirname+'\\..\\server\\static\\leagues\\'+rank+'.json', (err, data) => {
      let parsedData = JSON.parse(data)
      ranks[rank] = parsedData.list
      log(`${ranks[rank].length} documents found for ${rank}.`, 'info')
    })
    await waitFor(2000)
  })

  await Object.keys(ranks).asyncForEach(async rank => {
    var list = ranks[rank];
    if (list.length > 0) {
      await list.asyncForEach(async league => {
        await SummonerProfileService.getById(league.summonerId, async profile => {
          if (!profile) {
            try {
              var res = await localClient.post('/summonerProfiles/generateProfile?language='+region, {name: league.summonerName});
              await waitFor
              (500)
              list.shift();
              let data = JSON.stringify({list: list})

              fs.writeFileSync(__dirname+'\\..\\server\\static\\leagues\\'+rank+'.json', data)
              log("Generated profile for "+league.summonerName+"!, "+list.length+" documents left.", 'success')
            } catch(err) {
              log(`Could not generate profile for ${league.summonerName}`, 'error')
            }
          }
        })
      })
    }
  })

  
}


main();