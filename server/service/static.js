const log = require('../config/log');
Array.prototype.asyncForEach = async function(cb) {
  for(let i=0; i<this.length; i++) {
    await cb(this[i], i, this)
  }
}

module.exports = (region, language) => {
  var local = require('../config/localClient')(region);
  return {
    async updateChampionList() {
      try {
        var res = await local.post(`/statics/update/champions?language=${language}`)
        log('Updated champion list for '+language, 'success')
        callback(res.data)
      } catch(err) {
        log('Failed to update champion list for '+language, 'error')
        callback(false)
      }
    },
    async getChampionByKey(key, callback) {
      try {
        var res = await local.get(`/statics/champion/key/${key}?language=${language}`)
        log(`${res.data.name} was retrived from static assets ${language}`, 'success')
        callback(res.data)
      } catch(err) {
        log(`Failed to find ${key} from ${language} static data`, 'error')
        callback(false)
      }
    }
  }
}