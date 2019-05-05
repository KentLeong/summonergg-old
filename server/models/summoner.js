var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const config = require('../../config');

var schema = new Schema({
  profileIconId: Number,
  name: String,
  puuid: String,
  summonerLevel: Number,
  revisionDate: Date,
  id: String,
  accountId: String
})

module.exports = mongoose.model('Summoner', schema)