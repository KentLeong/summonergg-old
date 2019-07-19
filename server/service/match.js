const log = require('../config/log');
const dev = require('../config/dev');
const riot = require('../config/riot');
const gameModes = require('../static/gameModes');
const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
Array.prototype.asyncForEach = async function(cb) {
  for(let i=0; i<this.length; i++) {
    await cb(this[i], i, this)
  }
}

module.exports = (region) => {
  var local = require('../config/localClient')(region);
  var RiotMatch =require('../riot/match')(region);
  var rate = require('./rate')();
  return {
    async getLocation(time, type, callback) {
      var location = false;
      var server = false;
      var now = new Date();
      //set location
      if (time.length > 10) {
        var created = new Date(+time);
        var year = created.getUTCFullYear()
        var month = created.getUTCMonth()+1
        var daysAgo = ((((now-created)/1000)/60)/60)/24;
        if (type) location = `${year}_${month}_${type}`;
        if (daysAgo < riot.archive && type) location = "recent";
      } else {
        location = time
      }
      //set server
      if (location != "recent") {
        // get server location
      }
      callback(server, location)
    },
    async formatMatchOptions(options, callback) {
      var query = [];
      var epoch = options.epoch;
      var date = options.date;
      var type = options.type;
      

      if (!type || !epoch && !date) {
        callback(false)
      } else {
        if (epoch) query.push("epoch="+epoch);
        if (date && !epoch) query.push("date="+date);
        if (riot.type.includes(type)) {
          query.push("type="+type)
        } else {
          query.push(gameModes[type].cat)
        }
  
        callback(query.join("&"))
      }
    },
    async getByName(name, options, callback) {
      await this.formatMatchOptions(options, async query => {
        if (query) {
          try {
            var res = await local.get(`/matches/name/${name}?${epoch}`)
            dev(`Found matches for ${name}`, 'success');
            callback(res.data)
          } catch(err) {
            dev(`Could not find matches for ${name}`, 'warning');
            callback(false)
          }
        } else {
          dev(`Wrong options: getByName()`, 'error')
          callback(false)
        }
      })
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
      /** 
        * OPTIONS***
        * champion
        * season
        * skip 
        * limit
        * queueId
        **/
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
    async getAllPlayerMatch(id, queue) {
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
      if (queue) options.query.queue = queue;
      do {
        await RiotMatch.getMatches(options, async res => {
          if (!res.matches) {
            done = true
          } else {
            matches = [...matches, ...res.matches]
            if (res.matches.length != 100) done = true;
            options.query.beginIndex += 100;
            options.query.endIndex += 100;
          }
        })
      } while(!done)
      await matches.asyncForEach(async (match, i) => {
        var found = false;
        await this.getByGameId(match.gameId, matchFound => {
          if (matchFound) {
            log(`[${i+1}] Match ID: ${match.gameId} already exists`,'warning')
            found = true
          }
        })
        // await waitFor(60)
        if (!found) {
          await waitFor(50);
          RiotMatch.byID(match.gameId, updatedMatch => {
            this.new(updatedMatch, done => {})
            log(`[${i+1}] finished saving match: ${match.gameId}`,'success')
          })
          
        }
      })
    }
  }
}