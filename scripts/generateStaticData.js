
const fs = require('fs');
const riot = require('../server/config/riot');
const log = require('../server/config/log');
Array.prototype.asyncForEach = async function(cb) {
  for(let i=0; i<this.length; i++) {
    await cb(this[i], i, this)
  }
}

var main = (async ()=>{
  var languageList = Object.keys(riot.languages)
  var champions = {};

  await languageList.asyncForEach(async lang => {
    async function getData(lang, callback) {
      var client = require('../server/config/ddragonClient')(lang);
      log('Retrieving champion list for '+lang, 'info')
      try {
        var res = await client.get('/champion.json')
        var list = res.data.data
        var champions = Object.keys(list);
        var newList = {};
    
        await champions.asyncForEach(c => {
          var key = (list[c].key).toString()
          newList[key] = list[c]
        })
        
        callback(newList)
      } catch(err) {
        log('error', 'error')
      }
    }
    await getData(lang, list => {
      champions[lang] = list
    })
  })


  log("finished", 'success')
  let data = JSON.stringify(champions);
  fs.writeFileSync('../server/static/champions.json', data);
})();


