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
        var res = await local.post(`/stats/`, {stat: stat})
        dev(`Stat saved for PUUID: ${stat.puuid}`, 'success')
        callback(res.data)
      } catch(err) {
        dev(`${stat.puuid} was not saved`, "error")
        callback(false)
      }
    },
    async get(puuid, callback) {
      try {
        var res = await local.get(`/stats/${puuid}`)
        dev(`Stat retrieved for: ${puuid}`, "success")
        callback(res.data)
      } catch(err) {
        dev(`Could not retrieve stats for: ${puuid}`, "error")
        callback(false)
      }
    },
    async update(stat, callback) {
      try {
        var res = await local.put('/stats/', {stat: stat})
        callback(res.data)
        dev(`Stat was updated`, "success")
      } catch (err) {
        dev(`Stat was not updated`, "error")
      }
    }
  }
}