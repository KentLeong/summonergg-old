var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  puuid: {type: String, index: true},
  lastUpdated: Date,
  timeline: [Number],
  champions: Object
})

module.exports = (mongo)=> {
  return mongo.model('Stat', schema);
}