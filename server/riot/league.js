var rp = require('request-promise');
var riot = require('../riot');

Array.prototype.asyncForEach = async function(cb) {
  for(let i=0; i<this.length; i++) {
    await cb(this[i], i, this)
  }
}

module.exports = (region) => {
  return {
    bySummonerID(id, callback) {
      rp(`https://${riot.endpoints[region]}.api.riotgames.com/lol/league/v4/entries/by-summoner/`+
      `${id}?api_key=${riot.key}`)
        .then(data => {
          var leagues = JSON.parse(data)
          callback(leagues)
        })
        .catch(err => {
          callback(err)
        })
    },
    byLeagueID(id, callback) {
      rp(`https://${riot.endpoints[region]}.api.riotgames.com/lol/league/v4/leagues/`+
      `${id}?api_key=${riot.key}`)
        .then(data => {
          var league = JSON.parse(data)
          callback(league)
        })
        .catch(err => {
          callback(false)
        })
    },
    retriveDivision(options, callback) {
      rp(`https://${riot.endpoints[region]}.api.riotgames.com/lol/league/v4/entries/`+
      `${options.queue}/${options.tier}/${options.division}?api_key=${riot.key}`)
        .then(data => {
          var division = JSON.parse(data)
          callback(division)
        })
        .catch(err => {
          callback(false)
        })
    },
    retriveChallenger(queue, callback) {
      rp(`https://${riot.endpoints[region]}.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/`+
      `${queue}?api_key=${riot.key}`)
        .then(data => {
          var league = JSON.parse(data)
          callback(league)
        })
        .catch(err => {
          callback(false)
        })
    },
    retriveGrandMaster(id, callback) {
      rp(`https://${riot.endpoints[region]}.api.riotgames.com/lol/league/v4/grandmasterleagues/by-queue/`+
      `${queue}?api_key=${riot.key}`)
        .then(data => {
          var league = JSON.parse(data)
          callback(league)
        })
        .catch(err => {
          callback(false)
        })
    },
    retriveMaster(id, callback) {
      rp(`https://${riot.endpoints[region]}.api.riotgames.com/lol/league/v4/masterleagues/by-queue/`+
      `${queue}?api_key=${riot.key}`)
        .then(data => {
          var league = JSON.parse(data)
          callback(league)
        })
        .catch(err => {
          callback(false)
        })
    }
  }
}