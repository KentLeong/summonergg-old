const config = require('../../config');
Array.prototype.asyncForEach = async function(cb) {
  for(let i=0; i<this.length; i++) {
    await cb(this[i], i, this)
  }
}

module.exports = (region) => {
  var local = require('../config/localClient')(region);
  var language = "en_US"
  return {
    async updateChampionList(language) {
      try {
        var res = await local.post(`/statics/update/champions?language=${language}`)
        callback(res.data)
      } catch(err) {
        if (err.response.data == []) {
          if (config.dev) console.error(`error: champion list was not updated for ${language}: service/static updateChampionList()`)
        }
        callback(false)
      }
    },
    async getChampionByKey(key, callback) {
      try {
        var res = await local.get(`/statics/champion/key/${key}?language=${language}`)
        callback(res.data)
      } catch(err) {
        console.log(err)
        callback(false)
      }
    }
  }
}