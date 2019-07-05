const log = require('../config/log');
module.exports = (region) => {
  var local = require('../config/localClient')(region);
  return {
    async getByName(name, callback) {
      try {
        var res = await local.get('/summoners/name/'+name)
        log(`Retrieved summoner data ${res.data.name} from local database!`, 'success')
        callback(res.data)
      } catch(err) {
        log(`Could not find summoner data ${name} from local database`, 'warning')
        callback(false)
      }
    },
    async new(summoner) {
      try {
        var res = await local.post('/summoners/', {summoner: summoner})
        log(`${summoner.name} was created!`, 'success')
      } catch(err) {
        log(`Failed to create ${summoner.name}`, 'error')
      }
    }
  }
}