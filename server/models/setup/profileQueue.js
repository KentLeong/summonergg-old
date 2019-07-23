var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var schema = new Schema({
  profileIconId: Number,
  name: String,
  puuid: {type:String, unique: true},
  summonerLevel: Number,
  revisionDate: Date,
  id: String,
  accountId: String
})

// Apply the uniqueValidator plugin to userSchema.
schema.plugin(uniqueValidator);

module.exports = (mongo)=> {
  return mongo.model('Profile_Queue', schema);
}