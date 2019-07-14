var axios = require('axios');
const riot = require('./riot');

module.exports = (region) => {
  var axiosInstance = axios.create({
    baseURL: `https://${riot.endpoints[region]['riot']}.api.riotgames.com`
  })
  return axiosInstance
}