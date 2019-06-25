var rp = require('request-promise');
var riot = require('../riot');

Array.prototype.asyncForEach = async function(cb) {
  for(let i=0; i<this.length; i++) {
    await cb(this[i], i, this)
  }
}
module.exports = (region) => {
  var StaticChampion = require('../models/static/champion')(region)
  return {
    async byID(id, callback) {
      await rp(`https://${riot.endpoints[region]}.api.riotgames.com/lol/match/v4/matches/`+
      `${id}?api_key=${riot.key}`)
        .then(data => {
          var match = JSON.parse(data)
          this.formatMatch(match).then(match => {
            callback(match)
          })
        })
        .catch(err => {
          callback(false)
        })
    },
    async byAccount(options, callback) {
      /** 
      * OPTIONS***
      * champion
      * season
      * endTime - miliseconds 
      * beginTime - miliseconds
      * endIndex
      * beginIndex
      * 
      * format ex: ""?endtime=12&beginTime=0&"
      **/
      var id = options.id;
      var query = options.query;
      await rp(`https://${riot.endpoints[region]}.api.riotgames.com/lol/match/v4/matchlists/by-account/`+
      `${id}?`+query+`api_key=${riot.key}`)
        .then(data => {
          var matches = JSON.parse(data).matches
          callback(matches)
        })
        .catch(err => {
          callback(false)
        })
  
    },
    async formatMatch(match) {
      var match = match

      // merge participants and participant identities
      await match.participantIdentities.asyncForEach((id, i) => {
        match.participants[i] = {...id.player, ...match.participants[i]};
      })      

      await delete match.participantIdentities;

      // switch champion ID to the actual champion
      await match.participants.asyncForEach(async (p, i) => {
        // get champion key and name
        var promise = StaticChampion.findOne({key: p.championId}).select("id name").exec()
        await promise.then(champion => {
          match.participants[i].championId = champion.id;
          match.participants[i].championName = champion.name;
        })
      })
      return match
    }
  }
  
}