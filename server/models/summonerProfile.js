var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  name: String,
  summoner: Object,
  leagues: [Object],
  matches: [Object],
  lastUpdated: Date
})
module.exports = (mongo)=> {
  return mongo.model('Summoner_profile', schema);
}