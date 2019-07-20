const MatchService = require('./server/service/match')("na")
const RiotMatch = require('./server/riot/match')('na')
const SummonerProfileService = require('./server/service/summonerProfile')("na")

// MatchService.getLocation("1561995856434", "solo", (server, location) => {
//   console.log(server)
//   console.log(location)
// })

var profile = {
  summoner: {
    accountId: "QFUAH2XqjrERE59UKv4fqI9zD4o65SUcQ7x_5gAUe6W1BOrUr4pesR12"
  },
  matches: []
}
var query = {
  season: 13,
  beginIndex: 0,
  endIndex: 10
}



let main = async () => {
  await MatchService.getAllRankedMatches(profile.summoner.accountId, 13, matches => {
    console.log(matches.length)
  })
}

main();
// MatchService.getAllPlayerMatch(id, "420");