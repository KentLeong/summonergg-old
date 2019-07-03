const config = require('../../config');
const riot = require('../config/riot')
module.exports = (region) => {
  const client = require('../config/riotClient')(region);
  return {
    async bySummonerID(id, callback) {
      try {
        var res = await client.get(`/lol/league/v4/entries/by-summoner/`+
        `${id}?api_key=${riot.key}`)
        callback(res.data)
      } catch(err) {
        console.log(err)
        callback(false)
      }
    },
    async byLeagueID(id, callback) {
      try {
        var res = await client.get(`/lol/league/v4/leagues/`+
        `${id}?api_key=${riot.key}`)
        callback(res.data)
      } catch(err) {
        console.log(err)
        callback(false)
      }
    },
    async retriveDivision(options, callback) {
      try {
        var res = await client.get(`/lol/league/v4/entries/`+
        `${options.queue}/${options.tier}/${options.division}?api_key=${riot.key}`)
        callback(res.data)
      } catch(err) {
        console.log(err)
        callback(false)
      }
    },
    async retriveChallenger(queue, callback) {
      try {
        var res = await client.get(`/lol/league/v4/challengerleagues/by-queue/`+
        `${queue}?api_key=${riot.key}`)
        callback(res.data)
      } catch(err) {
        console.log(err)
        callback(false)
      }
    },
    async retriveGrandMaster(id, callback) {
      try {
        var res = await client.get(`/lol/league/v4/grandmasterleagues/by-queue/`+
        `${queue}?api_key=${riot.key}`)
        callback(res.data)
      } catch(err) {
        console.log(err)
        callback(false)
      }
    },
    async retriveMaster(id, callback) {
      try {
        var res = await client.get(`/lol/league/v4/masterleagues/by-queue/`+
        `${queue}?api_key=${riot.key}`)
        callback(res.data)
      } catch(err) {
        console.log(err)
        callback(false)
      }
    }
  }
}