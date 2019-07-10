const log = require('../config/log');

Array.prototype.asyncForEach = async function(cb) {
  for(let i=0; i<this.length; i++) {
    await cb(this[i], i, this)
  }
}

module.exports = (region) => {
  var local = require('../config/localClient')(region);
  return {
    async getByName(name, callback) {
      try {
        var res = await local.get(`/leagues/name/${name}`)
        log(`Found league for ${name}!`, 'success')
        callback(res.data)
      } catch(err) {
        log(`League not found for ${name}`, "warning")
        callback(false)
      }
    },
    async new(league) {
      try {
        var res = await local.post('/leagues/', {league: league})
        log(`League for ${league.summonerName} was created`, 'success')
      } catch(err) {
        log('Failed to save League for '+league.summonerName, 'error')
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
          log('Solo Found, added!', 'success')
          newLeague["solo"] = league
        } else if (league.queueType == "RANKED_FLEX_TT") {
          log('Flex 3v3 Found, added!', 'success')
          newLeague["flex3v3"] = league
        } else if (league.queueType == "RANKED_FLEX_SR") {
          log('Flex 5v5 Found, added!', 'success')
          newLeague["flex5v5"] = league
        }
      })
      callback(newLeague)
    }
  }
}