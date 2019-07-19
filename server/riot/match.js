const riot = require('../config/riot');
const log = require('../config/log');
const dev = require('../config/dev');
Array.prototype.asyncForEach = async function(cb) {
  for(let i=0; i<this.length; i++) {
    await cb(this[i], i, this)
  }
}
module.exports = (region) => {
  const client = require('../config/riotClient')(region)
  return {
    async getMatches(options, callback) {
      // options = {accountId, query}
      // query = ?champion/queue/season/endTime/beginTime/endTime/beginIndex
      try {
        var query = ""
        Object.keys(options.query).forEach(q => {
          query += q+"="+options.query[q]+"&";
        })
        var res = await client.get('/lol/match/v4/matchlists/by-account/'+
        `${options.accountId}?${query}api_key=${riot.key}`)
        var op = query.split('&').join(' ')
        dev(`Retrieved matches by account ID: ${options.accountId} with options: ${op}, from riot API`, 'success')
        callback(res.data)
      } catch(err) {
        dev(`Failed to retrieve matches by accountID: ${options.accountId} with options: ${options}, from riot API`, 'error')
        callback(false)
      }
    },
    async byID(id, callback) {
      try {
        var res = await client.get(`/lol/match/v4/matches/`+
        `${id}?api_key=${riot.key}`)
        var match = res.data
        dev(`Found Match ID: ${id}, from riot API`, 'success');
        await this.formatMatch(match).then(async match => {
          dev(`Match ID: ${id} formated`, 'success')
          await callback(match)
        })
      } catch(err) {
        dev(`Match ID: ${id} was not found`, 'warning')
      }
    },
    async formatMatch(match) {
      dev(`formating match (combining participants).. `, 'info')
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