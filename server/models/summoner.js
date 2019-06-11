var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const config = require('../../config');

var schema = new Schema({
  profileIconId: Number,
  name: String,
  puuid: String,
  summonerLevel: Number,
  revisionDate: Date,
  id: String,
  accountId: String
})
module.exports = (region)=> {
  mongoose.connect("mongodb://localhost:27017/sgg_"+region, {useNewUrlParser: true});
  return mongoose.model('Summoner', schema);
}