const riot = require('../config/riot')
module.exports = (region) => {
  var client = require('../config/riotClient')(region);
  return {
    async getByName(name, callback) {
      try {
        var res = await client.get(`/lol/summoner/v4/summoners/by-name/`+
        `${encodeURI(name)}?api_key=${riot.key}`)
        callback(res.data)
      } catch(err) {
        callback(false)
      }
    },
    async getByAccountID(id, callback) {
      try {
        var res = await client.get(`/lol/summoner/v4/summoners/by-account/`+
        `${id}?api_key=${riot.key}`)
        callback(res.data)
      } catch(err) {
        calllback(false)
      }
    },
    async getByPUUID(id, callback) {
      try {
        var res = await client.get(`/lol/summoner/v4/summoners/by-PUUID/`+
        `${id}?api_key=${riot.key}`)
        callback(res.data)
      } catch(err) {
        calllback(false)
      }
    },
    async getBySummonerID(id, callback){
      try {
        var res = await client.get(`/lol/summoner/v4/summoners/by-summoner/`+
        `${id}?api_key=${riot.key}`)
        callback(res.data)
      } catch(err) {
        calllback(false)
      }
    }
  }
}