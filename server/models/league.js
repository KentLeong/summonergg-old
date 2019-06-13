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

module.exports = (region)=> {
  mongoose.connect("mongodb://localhost:27017/sgg_"+region, {useNewUrlParser: true});
  return mongoose.model('League', schema);
}