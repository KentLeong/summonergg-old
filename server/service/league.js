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
    }
  }
}