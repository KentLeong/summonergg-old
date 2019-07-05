const log = require('../config/log');
const riot = require('../config/riot')
module.exports = (region) => {
  const client = require('../config/riotClient')(region);
  return {
    async bySummonerID(id, callback) {
      try {
        var res = await client.get(`/lol/league/v4/entries/by-summoner/`+
        `${id}?api_key=${riot.key}`)
        log(`Retrieved leagues by summoner ID: ${id}, from riot API`, 'success')
        callback(res.data)
      } catch(err) {
        log(`Failed to get leagues by summoner ID: ${id} from riot API`, 'error')
        callback(false)
      }
    },
    async byLeagueID(id, callback) {
      try {
        var res = await client.get(`/lol/league/v4/leagues/`+
        `${id}?api_key=${riot.key}`)
        log(`Retrieved leagues by league ID: ${id}, from riot API`, 'success')
        callback(res.data)
      } catch(err) {
        log(`Failed to get leagues by league ID: ${id} from riot API`, 'error')
        callback(false)
      }
    },
    async retriveDivision(options, callback) {
      try {
        var res = await client.get(`/lol/league/v4/entries/`+
        `${options.queue}/${options.tier}/${options.division}?api_key=${riot.key}`)
        log(`Retrieved divison for ${options.queue}/${options.tier}/${options.divison}, from riot API`, 'success')
        callback(res.data)
      } catch(err) {
        log(`Failed to get divison for ${options.queue}/${options.tier}/${options.divison} from riot API`, 'error')
        callback(false)
      }
    },
    async retriveChallenger(queue, callback) {
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
    async retriveGrandMaster(id, callback) {
      try {
        var res = await client.get(`/lol/league/v4/grandmasterleagues/by-queue/`+
        `${queue}?api_key=${riot.key}`)
        log(`Retrieved grandmaster division from riot API`, 'success')
      } catch(err) {
        log(`Failed to retrieve grandmaster division from riot API`, 'error')
        callback(false)
      }
    },
    async retriveMaster(id, callback) {
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