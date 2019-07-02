const axios = require('axios');
const match = require('./server/riot/match')("na");
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



var getSummonerProfile = async(callback) => {
  try {
    var res = await axios.get('http://na.localhost.gg/api/summonerProfiles/pass');
    callback();
    return res.data
  } catch(err) {
    console.log(err)
  }
}
var checks = {
  profile: false,
  match: false
}
match.byID("3074121230", match =>{
  checks.match = true;
  checkComplete()
});
getSummonerProfile(()=> {
  checks.profile = true;
  checkComplete()
});

function checkComplete() {
  if (checks.profile && checks.match) {
    console.log('completed')
  }
}
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