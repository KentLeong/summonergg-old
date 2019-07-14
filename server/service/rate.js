const fs = require('fs');
const riot = require('../config/riot');
const log = require('../config/log');

Array.prototype.asyncForEach = async function(cb) {
  for(let i=0; i<this.length; i++) {
    await cb(this[i], i, this)
  }
}

module.exports = () => {
  var secondRate = riot.secondRate;
  var minuteRate = riot.minuteRate;
  var currentRate = {};
  fs.readFile(__dirname+'\\..\\config\\rate.json', (err, data) => {
    if (!data) {
      log('rate.json not found. create...', 'info')
      var rate = {
        second: 0,
        minute: 0,
        secondUpdated: new Date().getTime(),
        minuteUpdated: new Date().getTime()
      }
      let data = JSON.stringify(rate);
      fs.writeFileSync(__dirname+'\\..\\config\\rate.json', data);
      currentRate = rate;
    } else {
      currentRate = JSON.parse(data);
    }
  })
  return {
    async remainingRate(callback) {
      setTimeout(()=>{
        let seconds = secondRate - currentRate.second
        let minutes = minuteRate - currentRate.minute
        callback(currentRate, seconds, minutes)        
      }, 10)
    },
    async rateUsed(used) {
      setTimeout(() => {
        var now = new Date().getTime();
        if (now - currentRate.secondUpdated > (10*1000)) {
          currentRate.secondUpdated = now;
          currentRate.second = 0;
        } else if (now - currentRate.minuteUpdated > (600*1000)) {
          currentRate.minuteUpdated = now;
          currentRate.minute = 0;
        }

        currentRate.second += used;
        currentRate.minute += used;
        let data = JSON.stringify(currentRate);
        fs.writeFileSync(__dirname+'\\..\\config\\rate.json', data);
      }, 10)
    }
  }
}