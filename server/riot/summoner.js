const riot = require('../config/riot');
const axios = require('axios');
const log = require('../config/log');
module.exports = (region) => {
  var client = require('../config/riotClient')(region);
  return {
    async getByAccountIDWithRegion(id, region, callback) {
      try {
        var res = await axios.get(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-account/${id}?api_key=${riot.key}`)
        log(`accessed riot from external region: ${region}, found ${res.data.name}!`, 'success')
        callback(res.data)
      } catch(err) {
        log(`could not find summoner for ${id} in region ${region}`)
        callback(false)
      }
    },
    async getByName(name, callback) {
      try {
        var name = decodeURI(name)
        var res = await client.get(`/lol/summoner/v4/summoners/by-name/`+
        `${encodeURI(name)}?api_key=${riot.key}`)
        log(`Found summoner data: ${res.data.name} by name from riot API`, 'success')
        callback(res.data)
      } catch(err) {
        log(`Failed to retrieve summoner data for: ${name} by name from riot API`, 'warning')
        callback(false)
      }
    },
    async getByAccountID(id, callback) {
      try {
        var res = await client.get(`/lol/summoner/v4/summoners/by-account/`+
        `${id}?api_key=${riot.key}`)
        log(`Found summoner data: ${res.data.name} by account id from riot API`, 'success')
        callback(res.data)
      } catch(err) {
        log(`Failed to retrieve summoner data for: ${id} by account id from riot API`, 'warning')
        callback(false)
      }
    },
    async getByPUUID(id, callback) {
      try {
        var res = await client.get(`/lol/summoner/v4/summoners/by-PUUID/`+
        `${id}?api_key=${riot.key}`)
        log(`Found summoner data: ${res.data.name} by puuid from riot API`, 'success')
        callback(res.data)
      } catch(err) {
        log(`Failed to retrieve summoner data for: ${id} by puuid from riot API`, 'warning')
        callback(false)
      }
    },
    async getBySummonerID(id, callback){
      try {
        var res = await client.get(`/lol/summoner/v4/summoners/by-summoner/`+
        `${id}?api_key=${riot.key}`)
        log(`Found summoner data: ${res.data.name} by summoner id from riot API`, 'success')
        callback(res.data)
      } catch(err) {
        log(`Failed to retrieve summoner data for: ${id} by summoner id from riot API`, 'warning')
        callback(false)
      }
    }
  }
}