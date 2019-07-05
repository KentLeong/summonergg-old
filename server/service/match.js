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
        var res = await local.get(`/matches/name/${name}`)
        log(`Found matches for ${name}`, 'success');
        callback(res.data)
      } catch(err) {
        log(`Could not find matches for ${name}`, 'warning');
        callback(false)
      }
    },
    async getById(id, callback) {
      try {
        var res = await local.get(`/matches/${id}`)
        log(`Match ID: ${id} found from local database!`, 'success');
        callback(res.data)
      } catch(err) {
        log(`Match ID: ${id} was not found from local database`, 'warning')
        callback(false)
      }
    },
    async new(match) {
      try {
        var res = await local.post('/matches/', {match: match})
        log(`Match ID: ${match.gameId} was saved`, 'success')
      } catch(err) {
        log(`Match ID: ${match.gameId} was not saved`, 'error')
      }
    }
  }
}