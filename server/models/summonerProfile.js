var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  summoner: String,
  leagues: Object,
  matches: [String],
  lastUpdated: {type: Date, default: Date.now()}
})
module.exports = (mongo)=> {
  return mongo.model('Summoner_profile', schema);
}