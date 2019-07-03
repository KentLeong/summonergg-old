const config = require("../../config");

module.exports = (region) => {
  var local = require('../config/localClient')(region);
  return {
    async getByName(name, callback) {
      try {
        var res = await local.get('/summoners/name/'+name)
        callback(res.data)
      } catch(err) {
        if (err.response.data == "not found") {
          if (config.dev) console.error("error: could not retreive "+name+", does not exist: service/summoner getByName():")
        } 
        callback(false)
      }
    },
    async new(summoner) {
      try {
        var res = await local.post('/summoners/', {summoner: summoner})
        if (config.dev) console.log(summoner.name+" created")
      } catch(err) {
        if (err.response.data == "exists") {
          if (config.dev) console.error("error: failed to create "+summoner.name+": service/summoner new()")
        }
      }
    }
  }
}