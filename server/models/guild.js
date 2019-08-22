var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
var Schema = mongoose.Schema;

var schema = new Schema({
  guildId: String,
  prefix: String,
  outputChannel: String,
  textChannel: String,
  voiceChannel: String,
  trusted: Boolean
})

schema.plugin(uniqueValidator);

module.exports = (mongo) => {
  return mongo.model('Guild', schema)
}