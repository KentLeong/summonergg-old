const log = require('../config/log');
const dev = require('../config/dev');
const riot = require('../config/riot');
const gameModes = require('../static/gameModes');
const seasons = require('../static/seasons');
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
      if (time == "recent") {
        location = "recent";
      } else if (time.length > 10) {
        var created = new Date(+time);
        var year = created.getUTCFullYear()
        var month = created.getUTCMonth()+1
        var daysAgo = ((((now-created)/1000)/60)/60)/24;
        if (type) location = `${year}_${month}_${type}`;
        if (daysAgo < riot.archive && type) location = "recent";
      } else {
        location = time+"_"+type
      }
      //set server
      if (location != "recent") {
        // get server location
      }
      callback(server, location)
    },
    async formatMatchOptions(options, callback) {
      // Epoch/Date  Type
      // Epoch and date is Optional but must have one.
      // Epoch takes presidence over date
      var query = [];
      var epoch = options.epoch;
      var date = options.date;
      var type = options.type;
      var failed = false;

      if (!epoch && !date) {
        failed = true;
      } else {
        if (epoch) query.push("epoch="+epoch);
        if (date && !epoch) query.push("date="+date);
        if (riot.types.includes(type)) {
          query.push("type="+type)
        } else if (gameModes[type]) {
          query.push("type="+gameModes[type].queue)
        }
        if (failed) {
          callback(false)
        } else {
          callback(query.join("&"))
        }
      }
    },
    async getByName(name, options, callback) {
      var query;
      await this.formatMatchOptions(options, async updatedQuery => {
        if (updatedQuery) {
          query = updatedQuery;
        } else {
          log(`Invalid Query: getByName()`, 'error')
        }
      })
      try {
        var res = await local.get(`/matches/name/${name}?${qeury}`)
        dev(`Found matches for ${name}`, 'success');
        callback(res.data)
      } catch(err) {
        dev(`Could not find matches for ${name}`, 'warning');
        callback(false)
      }
    },
    async getById(id, options, callback) {
      var query
      await this.formatMatchOptions(options, async updatedQuery => {
        if (updatedQuery) {
          query = updatedQuery
        } else {
          log("Invalid Query: Match.getById()", "error")
        }
      })
      try {
        var res = await local.get(`/matches/by-id/${id}`)
        dev(`Match ID: ${id} found from local database!`, 'success');
        callback(res.data)
      } catch(err) {
        dev(`Match ID: ${id} was not found from local database`, 'warning')
        callback(false)
      }
    },
    async getByGameId(id, options, callback) {
      var query;
      await this.formatMatchOptions(options, async updatedQuery => {
        if (updatedQuery) {
          query = updatedQuery;
        } else {
          log("Invalid Query: Match.getByGameId()", 'error')
        }
      })
      try {
        var res = await local.get(`/matches/${id}?${query}`)
        dev(`Match ID: ${id} found from local database!`, 'success');
        callback(res.data)
      } catch(err) {
        dev(`Match ID: ${id} was not found from local database`, 'warning')
        callback(false)
      }
    },
    async new(match, options, callback) {
      var query
      await this.formatMatchOptions(options, async updatedQuery => {
        if (updatedQuery) {
          query = updatedQuery;
        } else {
          log("query invalid: Match.new()", 'error')
        }
      })
      try {
        var res = await local.post('/matches/?'+query, {match: match})
        dev(`Match ID: ${match.gameId} was saved`, 'success')
        callback(res.data)
      } catch(err) {
        dev(`Match ID: ${match.gameId} was not saved`, 'error')
      }
    },
    async getAllRankedMatches(id, season, callback) {
      var matches = [];
      var counter = 1;
      var options = [{date:"recent"}];
      var rankedQueues = ["solo", "flex5v5", "flex3v3"];
      await seasons[season].duration.asyncForEach(async month => {
        await rankedQueues.asyncForEach((queue, i) => {
          var opt = {
            date: month,
            type: queue  
          }
          options.push(opt)
        })
      })
      await options.asyncForEach(async opt => {
        opt.seasonId = season;
        await this.getByAccount(id, opt, updatedMatches => {
          matches = [...matches, ...updatedMatches]
        })
      })
      callback(matches)
    },
    async getByAccount(id, options, callback) {
      var matchOption = {
        epoch: options.epoch,
        date: options.date,
        type: options.type
      }
      var query;
      delete options.epoch;
      delete options.date;
      delete options.type;
      await this.formatMatchOptions(matchOption, async updatedQuery => {
        if (updatedQuery) {
          query = updatedQuery;
        } else {
          log("Query Invalid: Match.getByAccountId()", 'error')
        }
      })
      /** 
        * OPTIONS***
        * champion
        * season
        * skip 
        * limit
        * queueId
        **/
      var multi = "?"
      Object.keys(options).forEach((op, i) => {
        if (i != 0) multi += "&";
        multi += op + "=" +options[op]
      })
      try {
        var res = await local.get(`/matches/multi/${id}${multi+"&"+query}`)
        dev(`Retrieved matches for AccountID: ${id}`, 'success')
        callback(res.data)
      } catch(err) {
        dev(`Could not retrieve matches for AccountID: ${id}`, "error")
      }
    },
    async getAllPlayerMatch(id, queue, callback) {
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
        var opt = {
          epoch: match.timestamp,
          type: match.queue
        }
        await this.getByGameId(match.gameId, opt, matchFound => {
          if (matchFound) {
            log(`[${i+1}] Match ID: ${match.gameId} already exists`,'warning')
            found = true
          }
        })
        if (!found) {
          await waitFor(50)
          RiotMatch.byID(match.gameId, updatedMatch => {
            var opt = {
              epoch: updatedMatch.gameCreation,
              type: updatedMatch.queueId
            }
            this.new(updatedMatch, opt, done => {})
            log(`[${i+1}] finished saving match: ${match.gameId}`,'success')
          })
          
        }
        delete matches[i].platformId
        delete matches[i].champion
        delete matches[i].role
        delete matches[i].lane
      })
      callback(matches)
    }
  }
}