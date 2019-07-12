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
        var res = await local.get(`/matches/by-id/${id}`)
        log(`Match ID: ${id} found from local database!`, 'success');
        callback(res.data)
      } catch(err) {
        log(`Match ID: ${id} was not found from local database`, 'warning')
        callback(false)
      }
    },
    async getByGameId(id, callback) {
      try {
        var res = await local.get(`/matches/${id}`)
        log(`Match ID: ${id} found from local database!`, 'success');
        callback(res.data)
      } catch(err) {
        log(`Match ID: ${id} was not found from local database`, 'warning')
        callback(false)
      }
    },
    async new(match, callback) {
      try {
        var res = await local.post('/matches/', {match: match})
        log(`Match ID: ${match.gameId} was saved`, 'success')
        callback(res.data)
      } catch(err) {
        log(`Match ID: ${match.gameId} was not saved`, 'error')
      }
    },
    async getByAccount(id, options, callback) {
      var query = "?"
      Object.keys(options).forEach((op, i) => {
        if (i != 0) query += "&";
        query += op + "=" +options[op]
      })
      try {
        var res = await local.get(`/matches/multi/${id}${query}`)
        log(`Retrieved matches for AccountID: ${id}`, 'success')
        callback(res.data)
      } catch(err) {
        log(`Could not retrieve matches for AccountID: ${id}`, "error")
      }
    }
  }
}