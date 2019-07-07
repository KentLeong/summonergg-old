const log = require('../config/log');
const champions = require('../static/champions');
Array.prototype.asyncForEach = async function(cb) {
  for(let i=0; i<this.length; i++) {
    await cb(this[i], i, this)
  }
}
module.exports = (region) => {
  var local = require('../config/localClient')(region);
  var static = require('./static')(region)
  return {
    async get(name, callback) {
      try {
        var res = await local.get('/summonerProfiles/'+name)
        log(`Found summoner profile of ${res.data.summoner.name} from local database`, 'success')
        callback(res.data)
      } catch(err) {
        log(`Could not find summoner profile of ${name}`, 'warning')
        callback(false)
      }
    },
    async new(profile) {
      try {
        var res = await local.post('/summonerProfiles/', {summonerProfile: profile})
        log(`${profile.summoner.name} summoner profile was saved`, 'success')
      } catch(err) {
        log(`${profile.summoner.name} summoner profile was not created`, 'error')
      }
    },
    async formatMatches(summoner, matches, callback) {
      await matches.asyncForEach(async (match, i) => {
        await match.participants.asyncForEach(part => {
          if (summoner.accountId == part.currentAccountId) {
            matches[i].profileIcon = part.profileIcon;
            matches[i].teamId = part.teamId;
            matches[i].championId = part.championId;
            matches[i].spell1Id = part.spell1Id;
            matches[i].spell2Id = part.spell2Id;
            matches[i].timeline = part.timeline;
            matches[i].items = [part.stats.item0,
                              part.stats.item1,
                              part.stats.item2,
                              part.stats.item3,
                              part.stats.item4,
                              part.stats.item5];
            matches[i].trinket = part.stats.item6;
            matches[i].kills = part.stats.kills;
            matches[i].deaths = part.stats.deaths;
            matches[i].assists = part.stats.assists;
            matches[i].champLevel = part.stats.champLevel;
            matches[i].vision = part.stats.visionWardsBoughtInGame;
            matches[i].goldEarned = part.stats.goldEarned;
            matches[i].mainPerk = part.stats.perk0;
            matches[i].secondaryPerk = part.stats.perkSubStyle;
            if (part.teamId == 100 && match.teams[0].win == "Win") {
              matches[i].outcome = "Victory";
            } else {
              matches[i].outcome = "Defeat";
            }
          }
          delete part.stats;
          delete part.timeline;
          delete part.matchHistoryUri;
          delete part.highestAchievedSeasonTier;
        })
      })
      callback(matches)
    },
    async translate(profile, language, callback) {
      await profile.matches.asyncForEach(async (match, i) => {
        let key = match.championId;
        profile.matches[i].championId = {
          id: champions[language][key].id,
          name: champions[language][key].name
        }
        await match.participants.asyncForEach(async (part, p) => {
          profile.matches[i].participants[p].championId = {
            id: champions[language][key].id,
            name: champions[language][key].name
          }
        })
      })
      callback(profile)
    }
  }
}