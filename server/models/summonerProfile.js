var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  summoner: Object,
  leagues: {
    solo: Object,
    flexSR: Object,
    flexTT: Object
  },
  matches: [Object],
  stats: Object,
  recent: Object,
  top5: Object,
  lastUpdated: {type: Date, default: Date.now()}
})
module.exports = (mongo)=> {
  return mongo.model('Summoner_profile', schema);
}