const axios = require('axios');
const riot = require('../config/riot');
const config = require('../../config');

module.exports = (region) => {
  Summoner = require('../models/summoner')(region);
  Match = require('../models/match')(region);
  League = require('../models/league')(region);
  return {
  }
}