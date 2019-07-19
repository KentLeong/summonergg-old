var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  puuid: String,
  lastUpdated: Date,
  timeline: [Number],
  champions: Object
})

module.exports = (mongo)=> {
  return mongo.model('Stat', schema);
}