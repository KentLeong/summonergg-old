module.exports = (language) => {
  var ddragon = require('../config/ddragonClient')(language);

  return {
    async getList(callback) {
      console.log("run")
      try {
        var res = await ddragon.get('/champion.json')
        var nameList = res.data.data
        var championList = []
        await Object.keys(nameList).forEach(champion => {
          championList.push(nameList[champion])
        })
        callback(championList)
      } catch(err) {
        console.error(err)
      }
    }
  }
}