var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  id: String,
  key: String,
  name: String,
  title: String,
  image: Object,
  skins: [Object],
  lore: String,
  blurb: String,
  allytips: [String],
  enemytips: [String],
  tags: [String],
  partype: String,
  info: Object,
  stats: Object,
  spells: [Object],
  passive: Object,
  recommended: [Object]
})


module.exports = (region) => {
  mongoose.connect("mongodb://localhost:27017/sgg_"+region, {useNewUrlParser: true});
  return mongoose.model('Static_champion', schema)
}