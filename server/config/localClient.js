var axios = require('axios');
const config = require('../../config');

module.exports = (region) => {
  return axios.create({
    baseURL: config.dev ? `https://${region}.localhost.gg/api` : `https://${region}.summoner.gg/api`
  })
}