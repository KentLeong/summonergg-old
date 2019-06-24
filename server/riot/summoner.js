var rp = require('request-promise');
var riot = require('../riot');
module.exports = (region) => {
  var region = riot.endpoints[region];
  return {
    getByName(name, callback) {
      rp(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/`+
      `${encodeURI(name)}?api_key=${riot.key}`)
        .then(data => {
          var summoner = JSON.parse(data);
          callback(summoner);
        })
        .catch(err => {callback(false)})
    },
    getByAccountID(id, callback) {
      rp(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-account/`+
      `${id}?api_key=${riot.key}`)
        .then(data => {
          var summoner = JSON.parse(data);
          callback(summoner);
        })
        .catch(err => {callback(false)})

    },
    getByPUUID(id, callback) {
      rp(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-account/`+
      `${id}?api_key=${riot.key}`)
        .then(data => {
          var summoner = JSON.parse(data);
          callback(summoner);
        })
        .catch(err => {callback(false)})

    },
    getBySummonerID(id, callback){
      rp(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-account/`+
      `${id}?api_key=${riot.key}`)
        .then(data => {
          var summoner = JSON.parse(data);
          callback(summoner);
        })
        .catch(err => {callback(false)})
    }
  }
}