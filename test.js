const axios = require('axios');
const MatchService = require('./server/service/match')("na");
const RiotMatch = require('./server/riot/match')("na");
const static = require('./server/static/champions.json')

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

Array.prototype.asyncForEach = async function(cb) {
  for(let i=0; i<this.length; i++) {
    await cb(this[i], i, this)
  }
}

String.prototype.capitalize = () => {
  console.log(this)
}
var a = [1,2,3,4,5,6,7,8,9,10]

function order(items) {
  items.sort((a,b) => {
    if (a == 0) return b
  })
  console.log(items)
}

order([0,123,0,12,0,23])