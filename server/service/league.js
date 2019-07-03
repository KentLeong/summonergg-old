const config = require('../../config');
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
        callback(res.data)
      } catch(err) {
        if (err.response.data == []) {
          if (config.dev) console.error(`error: no leagues found for ${name}: service/league getByName()`)
        }
        callback(false)
      }
    },
    async new(league) {
      try {
        var res = await local.post('/leagues/', {league: league})
        if (config.dev) console.log("league created")
      } catch(err) {
        if (config.dev) console.error(err)
      }
    }
  }
}