var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const config = require('../../config');

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
  participantIdentities: Object
})

module.exports = mongoose.model('Match', schema)