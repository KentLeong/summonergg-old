const axios = require('axios');
const MatchService = require('./server/service/match')("na");
const RiotMatch = require('./server/riot/match')("na");
const static = require('./server/static/champions.json')
const RiotLeague = require('./server/riot/league')('na');
const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}


var main = async function() {
  var matches = [];
}

main();