var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
  rate: {type: String, required:true, unique:true},
  tenSeconds: {type: Date, default: Date.now()},
  tenMinutes: {type: Date, default: Date.now()},
  secondRate: {type: Number, default: 0},
  minuteRate: {type: Number, default: 0}
})

schema.plugin(uniqueValidator);

module.exports = (mongo) => {
  return mongo.model('Rate', schema)
}