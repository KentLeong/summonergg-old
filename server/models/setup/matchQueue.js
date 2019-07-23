var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var schema = new Schema({
  gameId: String
})

// Apply the uniqueValidator plugin to userSchema.
schema.plugin(uniqueValidator);

module.exports = (mongo)=> {
  return mongo.model('Match_Queue', schema);
}