var axios = require('axios');
const riot = require('./riot');
module.exports = (language) => {
  return axios.create({
    baseURL: `http://ddragon.leagueoflegends.com/cdn/${riot.ver}/data/${riot.languages[language]}`
  })
}