const log = require('../config/log');
module.exports = (language) => {
  var ddragon = require('../config/ddragonClient')(language);

  return {
    async getList(callback) {
      log('Retrieving champion list..', 'info')
      try {
        var res = await ddragon.get('/champion.json')
        var nameList = res.data.data
        var championList = []
        await Object.keys(nameList).forEach(champion => {
          championList.push(nameList[champion])
        })
        log('Retrieved champion list', 'success')
        callback(championList)
      } catch(err) {
        log('could not get champion list', 'error')
      }
    }
  }
}