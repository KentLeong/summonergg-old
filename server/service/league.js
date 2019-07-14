const log = require('../config/log');
const dev = require('../config/dev');
Array.prototype.asyncForEach = async function(cb) {
  for(let i=0; i<this.length; i++) {
    await cb(this[i], i, this)
  }
}

module.exports = (region) => {
  var local = require('../config/localClient')(region);
  return {
    async getById(id, callback) {
      try {
        var res = await local.get(`/leagues/by-id/${id}`)
        dev(`Found league for ${id}!`, 'success')
        callback(res.data)
      } catch(err) {
        dev(`League not found for ${id}`, "warning")
        callback(false)
      }
    },
    async getBySummonerId(id, queueType, callback) {
      try {
        var res = await local.get(`/leagues/by-summonerId/${id}?queueType=${queueType}`)
        dev(`Found league for ${res.data.summonerName}! type: ${queueType}`, 'success')
        callback(res.data)
      } catch(err) {
        dev(`League not found for ${id}, type: ${queueType}`, "warning")
        callback(false)
      }
    },
    async getByName(name, callback) {
      try {
        var res = await local.get(`/leagues/name/${name}`)
        dev(`Found league for ${name}! `, 'success')
        callback(res.data)
      } catch(err) {
        dev(`League not found for ${name}`, "warning")
        callback(false)
      }
    },
    async new(league, callback) {
      try {
        var res = await local.post('/leagues/', {league: league})
        dev(`League for ${league.summonerName} was created`, 'success')
        callback(res.data)
      } catch(err) {
        dev('Failed to save League for '+league.summonerName, 'error')
      }
    },
    async formatLeagues(leagues, callback) {
      var newLeague = {
        solo: {},
        flex_5v5: {},
        flex_3v3: {}
      }
      await leagues.asyncForEach(league => {
        league.tier = league.tier.toLowerCase()
        if (league.queueType == "RANKED_SOLO_5x5") {
          dev('Solo Found, added!', 'success')
          newLeague["solo"] = league
        } else if (league.queueType == "RANKED_FLEX_TT") {
          dev('Flex 3v3 Found, added!', 'success')
          newLeague["flex3v3"] = league
        } else if (league.queueType == "RANKED_FLEX_SR") {
          dev('Flex 5v5 Found, added!', 'success')
          newLeague["flex5v5"] = league
        }
      })
      callback(newLeague)
    }
  }
}