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
    async new(stat, callback) {
      try {
        console.log(stat)
        var res = await local.post(`/stats/`, {stat: stat})
        dev(`Stat saved for PUUID: ${stat.puuid}`, 'success')
        callback(res.data)
      } catch(err) {
        dev(`${stat.puuid} was not saved`, "error")
        callback(false)
      }
    }
  }
}