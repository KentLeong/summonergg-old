const MatchService = require('./server/service/match')("na")
const RiotMatch = require('./server/riot/match')('na')

MatchService.getLocation("1561995856434", "solo", (server, location) => {
  console.log(server)
  console.log(location)
})
// MatchService.getAllPlayerMatch(id, "420");