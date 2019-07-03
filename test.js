const axios = require('axios');
const MatchService = require('./server/service/match')("na");
const RiotMatch = require('./server/riot/match')("na");
var await = (async ()=> {
  var Champion = await require('./server/models/static/champion')("en_US");
  Champion.findOne({name: "Evelynn"}, (err, champion) => {
    console.log(champion.name)
  })
})();

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



// let main = (a.asyncForEach(async num => {
//   await waitFor(500)
//   console.log(num)
// }))();

// let main = (async ()=>{
//   await a.asyncForEach(async num => {
//     await waitFor(500)
//     console.log(num)
//     await a.asyncForEach(async num => {
//       await waitFor(500)
//       console.log(num)
//     })
//   })
// })();