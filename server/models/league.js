var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const config = require('../../config');

var schema = new Schema({
  queueType: String,
  summonerName: String,
  hotStreak: Boolean,
  wins: Number,
  veteran: Boolean,
  losses: Number,
  rank: String,
  tier: String,
  inactive: Boolean,
  freshBlood: Boolean,
  leagueId: String,
  summonerId: String,
  leaguePoints: Number
})

module.exports = mongoose.model('League', schema)