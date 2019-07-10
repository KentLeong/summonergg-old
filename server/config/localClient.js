var axios = require('axios');

module.exports = (region) => {
  return axios.create({
    baseURL: `http://${region}.summoner.gg/api`
  })
}