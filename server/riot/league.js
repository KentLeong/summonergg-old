const log = require('../config/log');
const dev = require('../config/dev');
const riot = require('../config/riot')
module.exports = (region) => {
  const client = require('../config/riotClient')(region);
  return {
    async bySummonerId(id, callback) {
      try {
        var res = await client.get(`/lol/league/v4/entries/by-summoner/`+
        `${id}?api_key=${riot.key}`)
        dev(`Retrieved leagues by summoner ID: ${id}, from riot API`, 'success')
        callback(res.data)
      } catch(err) {
        dev(`Failed to get leagues by summoner ID: ${id} from riot API`, 'error')
        callback(false)
      }
    },
    async byLeagueId(id, callback) {
      try {
        var res = await client.get(`/lol/league/v4/leagues/`+
        `${id}?api_key=${riot.key}`)
        dev(`Retrieved leagues by league ID: ${id}, from riot API`, 'success')
        callback(res.data)
      } catch(err) {
        dev(`Failed to get leagues by league ID: ${id} from riot API`, 'error')
        callback(false)
      }
    },
    async retrieveDivision(options, callback) {
      try {
        var res = await client.get(`/lol/league/v4/entries/`+
        `${options.queue}/${options.tier}/${options.division}?page=${options.page}&api_key=${riot.key}`)        
        log(`Retrieved page ${options.page} of divison for ${options.queue}/${options.tier}/${options.division}, from riot API`, 'success')
        callback(res.data)
      } catch(err) {
        log(`Failed to get page ${options.page} of divison ${options.queue}/${options.tier}/${options.division} from riot API`, 'error')
        callback(false)
      }
    },
    async retrieveChallenger(queue, callback) {
      try {
        var res = await client.get(`/lol/league/v4/challengerleagues/by-queue/`+
        `${queue}?api_key=${riot.key}`)
        log(`Retrieved challenger division from riot API`, 'success')
        callback(res.data)
      } catch(err) {
        log(`Failed to retrieve challenger division from riot API`, 'error')
        callback(false)
      }
    },
    async retrieveGrandMaster(queue, callback) {
      try {
        var res = await client.get(`/lol/league/v4/grandmasterleagues/by-queue/`+
        `${queue}?api_key=${riot.key}`)
        log(`Retrieved grandmaster division from riot API`, 'success')
        callback(res.data)
      } catch(err) {
        log(`Failed to retrieve grandmaster division from riot API`, 'error')
        callback(false)
      }
    },
    async retrieveMaster(queue, callback) {
      try {
        var res = await client.get(`/lol/league/v4/masterleagues/by-queue/`+
        `${queue}?api_key=${riot.key}`)
        log(`Retrieved master division from riot API`, 'success')
        callback(res.data)
      } catch(err) {
        log(`Failed to retrieve master division from riot API`, 'error')
        callback(false)
      }
    }
  }
}