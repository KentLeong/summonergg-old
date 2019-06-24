var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  name: String,
  summoner: Object,
  leagues: [Object],
  matches: [Object],
  lastUpdated: Date
})
module.exports = (region)=> {
  mongoose.connect("mongodb://localhost:27017/sgg_"+region, {useNewUrlParser: true});
  return mongoose.model('Summoner_profile', schema);
}