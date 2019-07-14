const region = "na"
const axios = require('axios');
const log = require('../server/config/log');
const rate = require('../server/service/rate')();
const SummonerProfileService = require('../server/service/summonerProfile')(region)
const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
Array.prototype.asyncForEach = async function(cb) {
  for(let i=0; i<this.length; i++) {
    await cb(this[i], i, this)
  }
}


var main = (async ()=> {
  var options = {
    skip: 0,
    limit: 500
  }
  var totalDocumentsFound = 0;
  do {
    var done = false
    var profiles = [];
    await SummonerProfileService.all(options, data => {
      profiles = data
      if (profiles.length == 0) done = true;
    })
    profiles.asyncForEach(async (profile, i) => {
      SummonerProfileService.findDeleteDuplicates(profile.summoner.puuid, duplicates => {
        if (+duplicates > 1) {
          log(`[${i+2+options.skip}] Found Duplicates for ${profile.summoner.name}`, 'warning');
        } else {
          totalDocumentsFound++
          log(`[${i+2+options.skip}] ${profile.summoner.name} OK`, 'success');
        }
      })
    })
    options.skip += 500
  } while (!done)
  log(`${totalDocumentsFound} duplicates found`, 'success')
})();