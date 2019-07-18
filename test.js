const MatchService = require('./server/service/match')("na")
const RiotMatch = require('./server/riot/match')('na')
MatchService.getAllPlayerMatch("QFUAH2XqjrERE59UKv4fqI9zD4o65SUcQ7x_5gAUe6W1BOrUr4pesR12")


// var options = {
//   accountId: "QFUAH2XqjrERE59UKv4fqI9zD4o65SUcQ7x_5gAUe6W1BOrUr4pesR12",
//   query: {
//     season: 13,
//     beginIndex: 0,
//     endIndex: 100
//   }
// }
// RiotMatch.getMatches(options, matches => {
//   console.log(matches)
// })