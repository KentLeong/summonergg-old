var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var schema = new Schema({
  summoner: {
    profileIconId: Number,
    name: {type: String, index: true},
    puuid: {type:String, unique: true, index: true},
    summonerLevel: Number,
    revisionDate: Date,
    id: {type: String, index: true},
    accountId: {type: String, index: true}
  },
  leagues: {
    solo: Object,
    flexSR: Object,
    flexTT: Object
  },
  matches: [Object],
  stats: Object,
  recent: Object,
  top5: [Object],
  lastUpdated: {type: Date, default: Date.now()}
})


// Apply the uniqueValidator plugin to userSchema.
schema.plugin(uniqueValidator);


module.exports = (mongo)=> {
  return mongo.model('Summoner_profile', schema);
}