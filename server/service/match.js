const log = require('../config/log');
const dev = require('../config/dev');
const riot = require('../config/riot')
const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
Array.prototype.asyncForEach = async function(cb) {
  for(let i=0; i<this.length; i++) {
    await cb(this[i], i, this)
  }
}

module.exports = (region) => {
  var local = require('../config/localClient')(region);
  var RiotMatch =require('../riot/match')(region);
  return {
    async getByName(name, callback) {
      try {
        var res = await local.get(`/matches/name/${name}`)
        dev(`Found matches for ${name}`, 'success');
        callback(res.data)
      } catch(err) {
        dev(`Could not find matches for ${name}`, 'warning');
        callback(false)
      }
    },
    async getById(id, callback) {
      try {
        var res = await local.get(`/matches/by-id/${id}`)
        dev(`Match ID: ${id} found from local database!`, 'success');
        callback(res.data)
      } catch(err) {
        dev(`Match ID: ${id} was not found from local database`, 'warning')
        callback(false)
      }
    },
    async getByGameId(id, callback) {
      try {
        var res = await local.get(`/matches/${id}`)
        dev(`Match ID: ${id} found from local database!`, 'success');
        callback(res.data)
      } catch(err) {
        dev(`Match ID: ${id} was not found from local database`, 'warning')
        callback(false)
      }
    },
    async new(match, callback) {
      try {
        var res = await local.post('/matches/', {match: match})
        dev(`Match ID: ${match.gameId} was saved`, 'success')
        callback(res.data)
      } catch(err) {
        dev(`Match ID: ${match.gameId} was not saved`, 'error')
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
        dev(`Retrieved matches for AccountID: ${id}`, 'success')
        callback(res.data)
      } catch(err) {
        dev(`Could not retrieve matches for AccountID: ${id}`, "error")
      }
    },
    async getAllPlayerMatch(id) {
      var done = false;
      var matches = [];
      var options = {
        accountId: id,
        query: {
          season: riot.season,
          beginIndex: 0,
          endIndex: 100
        }
      }
      do {
        await RiotMatch.getMatches(options, async res => {
          matches = [...matches, ...res.matches]
          if (res.matches.length != 100) done = true;
          options.query.beginIndex += 100;
          options.query.endIndex += 100;
          await waitFor(60);
        })
      } while(!done) 
      await matches.asyncForEach(async (match, i) => {
        await waitFor(60)
        var found = false;
        await this.getById(match.gameId, matchFound => {
          if (matchFound) found = true;
        })
        if (!found) {
          await RiotMatch.byID(match.gameId, updatedMatch => {
            match = updatedMatch
          })
          await this.new(match, done => {})
          log(`[${i}] finished saving match: ${match.gameId}`,'success')
        }
      })
    }
  }
}