const log = require('../config/log');
const dev = require('../config/dev');
module.exports = (region) => {
  var local = require('../config/localClient')(region);
  return {
    async getBySummonerId(id, callback) {
      try {
        var res = await local.get('/summoners/'+id)
        dev(`Retrieved summoner data ${res.data.name} from local database!`, 'success')
        callback(res.data)
      } catch(err) {
        dev(`Could not find summoner data ${id} from local database`, 'warning')
        callback(false)
      }
    },
    async getByName(name, callback) {
      try {
        var res = await local.get('/summoners/name/'+name)
        dev(`Retrieved summoner data ${res.data.name} from local database!`, 'success')
        callback(res.data)
      } catch(err) {
        dev(`Could not find summoner data ${name} from local database`, 'warning')
        callback(false)
      }
    },
    async getByAccount(id, callback) {
      try {
        var res = await local.get('/summoners/account-id/'+id)
        dev(`Retrieved summoner data ${res.data.name} from local database!`, 'success')
        callback(res.data)
      } catch(err) {
        dev(`Could not find summoner data AccountID: ${id} from local database`, 'warning')
        callback(false)
      }
    },
    async new(summoner, callback) {
      try {
        var res = await local.post('/summoners/', {summoner: summoner})
        dev(`${summoner.name} was created!`, 'success')
        callback(res.data)
      } catch(err) {
        dev(`Failed to create ${summoner.name}`, 'error')
      }
    }
  }
}