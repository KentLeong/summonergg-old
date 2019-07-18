const log = require('../config/log');
const dev = require('../config/dev');
const champions = require('../static/champions');
const gameMode = require('../static/gameModes');
Array.prototype.asyncForEach = async function(cb) {
  for(let i=0; i<this.length; i++) {
    await cb(this[i], i, this)
  }
}
module.exports = (region) => {
  var local = require('../config/localClient')(region);
  var static = require('./static')(region);
  
  var SummonerService = require('./summoner')(region);
  var LeagueService = require('./league')(region);
  var MatchService = require('./match')(region);
  var RiotMatch = require('../riot/match')(region);
  var RiotSummoner = require('../riot/summoner')(region);
  var RiotLeague = require('../riot/league')(region);
  return {
    async byPuuid(id, callback) {
      try {
        var res = await local.get('/summonerProfiles/by-puuid/'+id)
        dev(`got ${res.data.summoner.name} profile with puuid`, 'success')
        callback(res.data)
      } catch(err) {
        dev(`Could not get profile from puuid: ${id}`, 'warning')
        callback(false)
      }
    },
    async findDeleteDuplicates(id, callback) {
      try {
        var res = await local.get('/summonerProfiles/puuid-duplicates/'+id)
        callback(res.data)
      } catch(err) {
        callback(false)
      }
    },
    async all(options, callback) {
      try {
        var res = await local.get('/summonerProfiles/'+`?limit=${options.limit}&skip=${options.skip}`)
        dev(`retrieved every summoner profile`, 'success')
        callback(res.data)
      } catch(err) {
        dev(`failed to retrieve every summoner profile`, 'warning')
        callback(false)
      }
    },
    async get(name, callback) {
      try {
        var res = await local.get('/summonerProfiles/'+decodeURI(name))
        dev(`Found summoner profile of ${res.data.summoner.name} from local database`, 'success')
        callback(res.data)
      } catch(err) {
        dev(`Could not find summoner profile of ${name}`, 'warning')
        callback(false)
      }
    },
    async getById(id, callback) {
      try {
        var res = await local.get('/summonerProfiles/by-id/'+id)
        dev(`Found summoner profile of ${res.data.summoner.name} from local database`, 'success')
        callback(res.data)
      } catch(err) {
        dev(`Could not find summoner profile of ${id}`, 'warning')
        callback(false)
      }
    },
    async update(profile) {
      try {
        var res = await local.put('/summonerProfiles/', {summonerProfile: profile})
        dev(`${profile.summoner.name} summoner profile was updated`, 'success')
      } catch(err) {
        dev(`${profile.summoner.name} summoner profile was not created`, 'error')
      }
    },
    async new(profile) {
      try {
        var res = await local.post('/summonerProfiles/', {summonerProfile: profile})
        dev(`${profile.summoner.name} summoner profile was saved`, 'success')
      } catch(err) {
        dev(`${profile.summoner.name} summoner profile was not created`, 'error')
      }
    },
    async getSummoner(profile, name, callback) {
      var summoner = false;
      var used = 0;
      if (profile.summoner) {
        if (profile.summoner.accountId) summoner = true;
      }
      if (!summoner) {
        //find summoner
        await RiotSummoner.getByName(name, foundSummoner => {
          used++
          if (foundSummoner) profile.summoner = foundSummoner;
        })
      }
      callback(profile, used)
    },
    async getLeagues(profile, callback) {
      //get leagues
      var used = 0;
      var queues = {
        RANKED_SOLO_5x5: "solo",
        RANKED_FLEX_SR: "flexSR",
        RANKED_FLEX_TT: "flexTT"
      }
      if (!profile.leagues) {
        profile.leagues = {};
        await RiotLeague.bySummonerId(profile.summoner.id, async leagues => {
          used++;
          if (leagues.length > 0) {
            await leagues.asyncForEach(league => {
              profile.leagues[queues[league.queueType]] = league
            })
          }
        })
      }
      callback(profile, used)
    },
    async getMatches(profile, query, callback) {
      var used = 0;
      options = {
        accountId: profile.summoner.accountId,
        query: query
      }
      await RiotMatch.getMatches(options, retrievedMatches => {
        used++;
        if (retrievedMatches) profile.matches = retrievedMatches;
      })
      if (profile.matches) {
        var temp = [];
        await profile.matches.asyncForEach(async (match, i) => {
          var found = false
          await MatchService.getByGameId(match.gameId, retrievedMatch => {
            if (retrievedMatch) {
              found = true;
              temp.push(retrievedMatch);
            }
          })
          if (!found) {
            await RiotMatch.byID(match.gameId, async retrievedMatch => {
              used++;
              if (retrievedMatch) {
                await MatchService.new(retrievedMatch, updatedMatch => {
                  temp.push(updatedMatch)
                })
              }
            })
          }
        })
        profile.matches = temp
      }
      callback(profile, used)
    },
    async generateChampions(profile, callback) {
      if (!profile.champions) profile.recent = {};
      if (profile.matches.length > 0) {
        var done = false;
        // var options = {

        // }
        // do {
        //   MatchService.getByAccount()
        // } while (!done)
      }
      callback(profile)
    },
    async generateStats(profile, callback) {
      if (!profile.stats) profile.stats = {};
      if (profile.matches.length > 0) {
        profile.stats.lastPlayed = champions["English"][profile.matches[0].championId].id
      }
      this.calculateStreak(profile, updatedProfile => {
        profile = updatedProfile;
      })
      this.caclulateKda(profile, updatedProfile => {
        profile = updatedProfile;
      })
      
      callback(profile)
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
            } else if (part.teamId == 200 && match.teams[1].win == "Win") {
              matches[i].outcome = "Victory";
            } else {
              matches[i].outcome = "Defeat";
            }

            if (matches[i].gameDuration < 270) {
              matches[i].outcome = "Remake";
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

            // minions killed
            var minionsKilled = part.stats.neutralMinionsKilled + part.stats.totalMinionsKilled
            matches[i].minionsKilled = minionsKilled
            let gameMinutes = (match.gameDuration/60)
            matches[i].minionsPerMin = (minionsKilled/gameMinutes).toFixed(1)

            // kda
            matches[i].kda = ((part.stats.kills+part.stats.assists)/part.stats.assists).toFixed(2)

            // part
            var t1TotalKills = 0
            var t2TotalKills = 0
            await match.participants.asyncForEach(async (p, a) => {
              if (p.teamId == 100) {
                t1TotalKills+=p.stats.kills
              } else {
                t2TotalKills+=p.stats.kills
              }
            })
            var participation1 = ((part.stats.kills+part.stats.assists)/t1TotalKills).toFixed(2)*100
            var participation2 = ((part.stats.kills+part.stats.assists)/t2TotalKills).toFixed(2)*100
            if (part.teamId == 100) {
              matches[i].part = Math.floor(participation1)
            } else {
              matches[i].part = Math.floor(participation2)
            }

          }
        })
      })

      // sort roles
      dev('sorting match..', 'info')
      await matches.asyncForEach(async (match, i) => {
        var order = {
          top: 1,
          jungle: 2,
          middle: 3,
          bottom: 4,
          support: 5
        }
        if (match.queueId) {
          if (match.queueId.type == "Summoner's Rift") {
            match.participants.sort((a,b)=> {
              return order[a.role] - order[b.role]
            }) 
            match.participants.sort((a,b)=> {
              return a.teamId - b.teamId
            })
          }
        }
        // clean data
        match.blueTeam = [];
        match.redTeam = [];
        await match.participants.asyncForEach(async (part, i) => {
          if (part.teamId == 100) {
            match.blueTeam.push(part)
          } else if (part.teamId == 200) {
            match.redTeam.push(part)
          }
        })
      })
      await matches.asyncForEach(async match => {
        delete match.participants
      })
      callback(matches)
    },
    async translate(profile, language, callback) {
      await profile.matches.asyncForEach(async (match, i) => {
        let key = match.championId;
        if (champions[language][key]) {
          profile.matches[i].championId = {
            id: champions[language][key].id,
            name: champions[language][key].name
          }
        }
        await match.blueTeam.asyncForEach(async (part, p) => {
          let key = part.championId;
          if (champions[language][key]) {
            profile.matches[i].blueTeam[p].championId = {
              id: champions[language][key].id,
              name: champions[language][key].name
            }
          }
        })
        await match.redTeam.asyncForEach(async (part, p) => {
          let key = part.championId;
          if (champions[language][key]) {
            profile.matches[i].redTeam[p].championId = {
              id: champions[language][key].id,
              name: champions[language][key].name
            }
          }
        })
      })
      callback(profile)
    },
    async formatAndSave(profile) {
      await profile.matches.asyncForEach(async match => {
        await match.blueTeam.asyncForEach(part => {
          delete part.stats;
          delete part.timeline;
          delete part.spell1Id;
          delete part.spell2Id;
        })
        await match.redTeam.asyncForEach(part => {
          delete part.stats;
          delete part.timeline;
          delete part.spell1Id;
          delete part.spell2Id;
        })
      })
      if (Object.keys(profile.leagues).length > 0) {
        await Object.keys(profile.leagues).asyncForEach(league => {
          delete profile.leagues[league].summonerName;
          delete profile.leagues[league].summonerId;
        })
      }
      this.new(profile)
    },
    async formatAndUpdate(profile) {
      await profile.matches.asyncForEach(async match => {
        await match.blueTeam.asyncForEach(part => {
          delete part.stats;
          delete part.timeline;
          delete part.spell1Id;
          delete part.spell2Id;
        })
        await match.redTeam.asyncForEach(part => {
          delete part.stats;
          delete part.timeline;
          delete part.spell1Id;
          delete part.spell2Id;
        })
      })
      if (Object.keys(profile.leagues).length > 0) {
        await Object.keys(profile.leagues).asyncForEach(league => {
          delete profile.leagues[league].summonerName;
          delete profile.leagues[league].summonerId;
        })
      }
      this.update(profile)
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
    },
    async calculateStreak(profile, callback) {
      // calculate streak
      profile.stats.streak = {
        outcome: "",
        num: 0 
      };
      profile.matches.some((match, i) => {
        var end = false;
        if (match.outcome != "Remake") {
          if (match.outcome == "Victory") {
            if (profile.stats.streak.outcome == "") {
              profile.stats.streak.outcome = "Win";
              profile.stats.streak.num++;
            } else if (profile.stats.streak.outcome == "Win") {
              profile.stats.streak.num++;
            } else {
              end = true;
            }
          }
          if (match.outcome == "Defeat") {
            if (profile.stats.streak.outcome == "") {
              profile.stats.streak.outcome = "Loss";
              profile.stats.streak.num++;
            } else if (profile.stats.streak.outcome == "Loss") {
              profile.stats.streak.num++;
            } else {
              end = true;
            }
          }
        }
        return end
      })
      callback(profile)
    },
    async caclulateKda(profile, callback) {
      //calculate kda
      var totalKills = 0;
      var totalAssists = 0;
      var totalDeaths = 0;
      var totalMatches = profile.matches.length;
      var totalWins = 0;
      var totalLosses = 0;
      var totalPart = 0;
      profile.matches.forEach((match) => {
        totalKills += match.kills;
        totalAssists += match.assists;
        totalDeaths += match.deaths;
        totalPart += match.part;
        if (match.outcome == "Victory") {
          totalWins++
        } else if (match.outcome == "Defeat") {
          totalLosses++
        }
      })
      var stats = {
        averageKills: Math.round(totalKills/totalMatches),
        averageAssists: Math.round(totalAssists/totalMatches),
        averageDeaths: Math.round(totalDeaths/totalMatches),
        winRate: Math.round((totalWins/(totalWins+totalLosses))*100),
        totalMatches: totalMatches,
        totalWins: totalWins,
        totalLosses: totalLosses,
        totalPart: Math.round(totalPart/totalMatches),
        kda: ((totalKills+totalAssists)/totalDeaths).toFixed(2)
      }
      profile.stats = {...profile.stats, ...stats};
      callback(profile)
    }
  }
}