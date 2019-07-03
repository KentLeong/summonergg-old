const riot = require('../config/riot');

module.exports = (region) => {
  const client = require('../config/riotClient')(region)
  return {
    async getMatches(options, callback) {
      // options = {accountID, query}
      try {
        var res = await client.get('/lol/match/v4/matchlists/by-account/'+
        `${options.accountId}?${options.query}api_key=${riot.key}`)
        callback(res.data.matches)
      } catch(err) {
        console.log(err)
      }
    },
    async byID(id, callback) {
      try {
        var res = await client.get(`/lol/match/v4/matches/`+
        `${id}?api_key=${riot.key}`)
        var match = res.data
        await this.formatMatch(match).then(match => {
          callback(match)
        })
      } catch(err) {
        console.log(err)
      }
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
      return match
    }
  }
  
}