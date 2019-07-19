const MatchService = require('./server/service/match')("na")
const RiotMatch = require('./server/riot/match')('na')

// MatchService.getLocation("1561995856434", "solo", (server, location) => {
//   console.log(server)
//   console.log(location)
// })

options = {
  epoch: "",
  date: "12_5_solo",
  queueId: "420"
}
MatchService.formatMatchOptions(options, query => {
  console.log(query)
})
// MatchService.getAllPlayerMatch(id, "420");