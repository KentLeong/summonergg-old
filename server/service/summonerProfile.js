const log = require('../config/log');
const champions = require('../static/champions');
const gameMode = require('../static/gameModes');
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
    async update(profile) {
      try {
        var res = await local.put('/summonerProfiles/', {summonerProfile: profile})
        log(`${profile.summoner.name} summoner profile was updated`, 'success')
      } catch(err) {
        log(`${profile.summoner.name} summoner profile was not created`, 'error')
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
      //role

      await matches.asyncForEach(async(match, i) => {
        await match.participants.asyncForEach(async (part, a) => {
          var role = part.timeline.role;
          var lane = part.timeline.lane;
          this.findRole(role, lane).then(role => {
            matches[i].participants[a].role = role
          })
        }) 
      })
      // everything else
      await matches.asyncForEach(async (match, i) => {
        var t1TotalKills = 0
        var t2TotalKills = 0
        await match.participants.asyncForEach(async (part, a) => {
          if (part.stats.teamId == 100) {
            t1TotalKills+=part.stats.kills
          } else {
            t2TotalKills+=part.stats.kills
          }
        })
        await match.participants.asyncForEach(async (part, a) => {
          if (summoner.accountId == part.currentAccountId) {
            matches[i].profileIcon = part.profileIcon;
            matches[i].teamId = part.teamId;
            matches[i].championId = part.championId;
            matches[i].spell1Id = part.spell1Id;
            matches[i].spell2Id = part.spell2Id;
            matches[i].cs = part.stats.totalMinionsKilled;
            matches[i].trinket = part.stats.item6;
            matches[i].kills = part.stats.kills;
            matches[i].deaths = part.stats.deaths;
            matches[i].assists = part.stats.assists;
            matches[i].champLevel = part.stats.champLevel;
            matches[i].vision = part.stats.visionWardsBoughtInGame;
            matches[i].goldEarned = part.stats.goldEarned;
            matches[i].mainPerk = part.stats.perk0;
            matches[i].secondaryPerk = part.stats.perkSubStyle;

            //outcome
            if (part.teamId == 100 && match.teams[0].win == "Win") {
              matches[i].outcome = "Victory";
            } else {
              matches[i].outcome = "Defeat";
            }

            // items
            matches[i].items = [part.stats.item0,
              part.stats.item1,
              part.stats.item2,
              part.stats.item3,
              part.stats.item4,
              part.stats.item5];
            matches[i].items.sort((a,b) => {
              if (a==0) return b
            })

            // queueType
            matches[i].queueId = gameMode[matches[i].queueId]

            // role
            matches[i].role = part.role

            // game duration
            matches[i].duration = {};
            let minutes = Math.floor(match.gameDuration/60);
            let seconds = match.gameDuration%60;
            matches[i].duration.minutes = minutes
            matches[i].duration.seconds = seconds

            // game played
            this.timePlayed(match.gameCreation).then(played => {
              matches[i].played = played
            })
            // kda
            matches[i].kda = ((part.stats.kills+part.stats.assists)/part.stats.assists).toFixed(2)

            // part
            if (part.teamId == 100) {
              matches[i].part = ((part.stats.kills+part.stats.assists)/t1TotalKills).toFixed(2)*100
            } else {
              matches[i].part = ((part.stats.kills+part.stats.assists)/t2TotalKills).toFixed(2)*100
            }
          }
          await delete part.stats;
          await delete part.matchHistoryUri;
          await delete part.highestAchievedSeasonTier;
          await delete part.timeline;
        })
      })

      // sort roles
      log('sorting match..', 'info')
      await matches.asyncForEach(async (match, i) => {
        var order = {
          top: 1,
          jungle: 2,
          middle: 3,
          bottom: 4,
          support: 5
        }
        if (match.queueId.type == "Summoner's Rift") {
          match.participants.sort((a,b)=> {
            return order[a.role] - order[b.role]
          }) 
          match.participants.sort((a,b)=> {
            return a.teamId - b.teamId
          })
        }
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
          let key = part.championId;
          profile.matches[i].participants[p].championId = {
            id: champions[language][key].id,
            name: champions[language][key].name
          }
        })
      })
      callback(profile)
    },
    async timePlayed(gameCreation) {
      var lastPlayed = new Date(gameCreation).getTime();
      let playedMinutes = Math.floor(((new Date()).getTime() - lastPlayed)/60000);
      if (playedMinutes < 1) {
        return `few seconds ago`
      } else if (playedMinutes < 60) {
        if (playedMinutes == 1) {
          return `${playedMinutes} minute ago`
        } else {
          return `${playedMinutes} minutes ago`
        }
      } else if (playedMinutes < 1440) {
        let hours = Math.floor(playedMinutes/60)
        if (hours == 1) {
          return `${hours} hour ago`
        } else {
          return `${hours} hours ago`
        }
      } else if (playedMinutes < 40320){
        let days = Math.floor(playedMinutes/1440)
        if (days = 1) {
          return `${days} day ago`
        } else {
          return `${days} days ago`
        }
      } else {
        let month = Math.floor(playedMinutes/40320)
        if (month == 1) {
          return `${month} month ago`
        } else {
          return `${month} months ago`
        }
      }

    },
    async findRole(role, lane) {
      if (lane == "JUNGLE") {
        if (role == "DUO_SUPPORT") {
          return "support"
        } else {
          return "jungle"
        }
      } else if (lane == "MIDDLE") {
        if (role == "DUO_SUPPORT") {
          return "support"
        } else {
          return "middle"
        }
      } else if (lane == "TOP") {
        if (role == "DUO_SUPPORT") {
          return "support"
        } else {
          return "top"
        }
      } else if (lane == "BOTTOM") {
        if (role == "DUO_SUPPORT") {
          return "support"
        } else {
          return "bottom"
        }
      }
    }
  }
}