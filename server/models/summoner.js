var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  profileIconId: Number,
  name: String,
  puuid: String,
  summonerLevel: Number,
  revisionDate: Date,
  id: String,
  accountId: String
})
module.exports = (mongo)=> {
  return mongo.model('Summoner', schema);
}