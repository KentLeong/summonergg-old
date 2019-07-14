var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var schema = new Schema({
  gameId: {type:String, unique: true},
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
  role: String
})

// Apply the uniqueValidator plugin to userSchema.
schema.plugin(uniqueValidator);

module.exports = (mongo)=> {
  return mongo.model('Match', schema);
}