var axios = require('axios');

module.exports = (region) => {
  return axios.create({
    baseURL: `http://${region}.localhost.gg/api`
  })
}