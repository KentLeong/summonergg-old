const MatchService = require('./server/service/match')("na")
const RiotMatch = require('./server/riot/match')('na')

var id = "AfuLyzCRZOxvhVrDD5SapmjbAqjpgliFw4hiSfgVXWRS7Q"

var options = {
  season: 13,
  queueId: {"$in": [420, 440, 470]}
}
MatchService.getByAccount(id, options, matches => {
  console.log(matches.length)
})

// MatchService.getAllPlayerMatch(id, "420");