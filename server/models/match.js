var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  gameId: Number,
  platformId: String,
  gameCreation: Date,
  gameDuration: Number,
  queueId: String,
  mapId: Number,
  seasonId: Number,
  gameVersion: String,
  gameMode: String,
  gameType: String,
  teams: Object,
  participants: Object,
  //for profile
  victory: String,
  championId: String,
  championName: String,
  role: String,
  spell1: String,
  spell2: String,
  perk1: String,
  perk2: String
})


module.exports = (mongo)=> {
  return mongo.model('Match', schema);
}