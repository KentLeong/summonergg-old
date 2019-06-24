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
  championId: String,
  championName: String
})


module.exports = (region)=> {
  mongoose.connect("mongodb://localhost:27017/sgg_"+region, {useNewUrlParser: true});
  return mongoose.model('Match', schema);
}