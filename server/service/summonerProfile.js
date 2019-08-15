const log = require('../config/log');
const dev = require('../config/dev');
const champions = require('../static/champions');
const gameMode = require('../static/gameModes');
const riot = require('../config/riot');
const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
Array.prototype.asyncForEach = async function(cb) {
  for(let i=0; i<this.length; i++) {
    await cb(this[i], i, this)
  }
}
module.exports = (region) => {
  var local = require('../config/localClient')(region);

  var MatchService = require('./match')(region);
  var RiotMatch = require('../riot/match')(region);
  var RiotSummoner = require('../riot/summoner')(region);
  var RiotLeague = require('../riot/league')(region);
  var StatService = require('../service/stat')(region);
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
    async getSummonerByPuuid(puuid, callback) {
      await RiotSummoner.getByPUUID(puuid, foundSummoner => {
        if (foundSummoner) {
          callback(foundSummoner)
        } else {
          callback(false)
        }
      })
    },
    async getSummoner(profile, name, callback) {
      var summoner = false;
      if (profile.summoner) {
        if (profile.summoner.accountId) summoner = true;
      }
      if (!summoner) {
        //find summoner
        await RiotSummoner.getByName(name, foundSummoner => {
          if (foundSummoner) profile.summoner = foundSummoner;
        })
      }
      callback(profile)
    },
    async getLeagues(profile, callback) {
      //get leagues
      var queues = {
        RANKED_SOLO_5x5: "solo",
        RANKED_FLEX_SR: "flexSR"
      }
      profile.leagues = {};
      await RiotLeague.bySummonerId(profile.summoner.id, async leagues => {
        if (leagues.length > 0) {
          await leagues.asyncForEach(league => {
            profile.leagues[queues[league.queueType]] = league
          })
        }
      })
      callback(profile)
    },
    async getRecentMatches(profile, query, callback) {
      options = {
        accountId: profile.summoner.accountId,
        query: query
      }
      await RiotMatch.getMatches(options, retrievedMatches => {
        if (retrievedMatches) profile.matches = retrievedMatches.matches;
      })
      if (profile.matches) {
        var temp = [];
        await profile.matches.asyncForEach(async (match, i) => {
          var found = false
          var opt = {
            epoch: match.timestamp,
            type: match.queue
          }
          await MatchService.getByGameId(match.gameId, opt, retrievedMatch => {
            if (retrievedMatch) {
              found = true;
              temp.push(retrievedMatch);
            }
          })
          if (!found) {
            await RiotMatch.byID(match.gameId, async retrievedMatch => {
              if (retrievedMatch) {
                var opt = {
                  epoch: retrievedMatch.gameCreation,
                  type: retrievedMatch.queueId
                }
                await MatchService.new(retrievedMatch, opt, updatedMatch => {
                  temp.push(updatedMatch)
                })
              }
            })
          }
        })
        profile.matches = temp
      }
      callback(profile)
    },
    async generateChampions(profile, matches, callback) {
      if (!profile.champions) profile.recent = {};
      if (matches.length > 0) {
        var champions = {};
        await matches.asyncForEach(match => {
          if (match.participants) {
            match.participants.some(part => {
              if (part.currentAccountId == profile.summoner.accountId) {
                var queue;
                if (match.queueId == "420" || match.queueId == "440") {
                  queue = match.queueId
                } else {
                  queue = "norm"
                }
                if (!champions[part.championId]) {
                  champions[part.championId] = {};
                  champions[part.championId][queue] = {
                    games: 0,
                    kills: 0,
                    deaths: 0,
                    assists: 0,
                    wins: 0,
                    losses: 0
                  };
                } else if (!champions[part.championId][queue]){
                  champions[part.championId][queue] = {
                    games: 0,
                    kills: 0,
                    deaths: 0,
                    assists: 0,
                    wins: 0,
                    losses: 0
                  };
                }
                
                champions[part.championId][queue].kills += part.stats.kills;
                champions[part.championId][queue].deaths += part.stats.deaths;
                champions[part.championId][queue].assists += part.stats.assists;
                if (part.stats.win && match.gameDuration > 400) {
                  champions[part.championId][queue].wins++
                  champions[part.championId][queue].games++;
                } else if (!part.stats.win && match.gameDuration > 400) {
                  champions[part.championId][queue].losses++
                  champions[part.championId][queue].games++;
                }
              }
              return (part.currentAccountId == profile.summoner.accountId)
            })
          }
        })
        await StatService.new({
          puuid: profile.summoner.puuid,
          champions: champions
        }, updatedStat => {
          callback(profile, {
            puuid: profile.summoner.puuid,
            champions: champions
          });
        })
      }
    },
    async updateChampions(profile, matches, callback) {
      if (!profile.champions) profile.recent = {};
      var stats;
      await StatService.get(profile.summoner.puuid, updatedStats => {
        if (updatedStats) stats = updatedStats;
      })
      if (!stats) {
        callback(profile, false)
      } else {
        var champions = stats.champions
        
        if (matches.length > 0) {
          await matches.asyncForEach(match => {
            if (match.participants) {
              match.participants.some(part => {
                if (part.currentAccountId == profile.summoner.accountId) {
                  var queue = match.queueId;
                  if (!champions[part.championId]) {
                    champions[part.championId] = {};
                    champions[part.championId][queue] = {
                      games: 0,
                      kills: 0,
                      deaths: 0,
                      assists: 0,
                      wins: 0,
                      losses: 0 
                    };
                  } else if (!champions[part.championId][queue]){
                    champions[part.championId][queue] = {
                      games: 0,
                      kills: 0,
                      deaths: 0,
                      assists: 0,
                      wins: 0,
                      losses: 0
                    };
                  }
                  
                  champions[part.championId][queue].kills += part.stats.kills;
                  champions[part.championId][queue].deaths += part.stats.deaths;
                  champions[part.championId][queue].assists += part.stats.assists;
                  if (part.stats.win && match.gameDuration > 400) {
                    champions[part.championId][queue].wins++
                    champions[part.championId][queue].games++;
                  } else if (!part.stats.win && match.gameDuration > 400) {
                    champions[part.championId][queue].losses++
                    champions[part.championId][queue].games++;
                  }
                }
                return (part.currentAccountId == profile.summoner.accountId)
              })
            }
          })
        }
        stats.champions = champions;
        await StatService.update(stats, updatedStat => {
          callback(profile, updatedStat);
        }) 
      }
    },
    async generateRecentPlayers(profile, callback) {
      if (!profile.recent) profile.recent = {};
      profile.recent.players = [];
      var list = {};
      var players = [];
      await profile.matches.asyncForEach(async match => {
        var win;
        match.outcome == "Victory" ? win = true : win = false;
        var team = match.teamId;
        
        if (team == "100" && match.outcome != "Remake") {
          await match.blueTeam.forEach(part => {
            if (part.currentAccountId != profile.summoner.accountId) {
              if (!list[part.summonerName]) {
                if (win) {
                  list[part.summonerName] = {
                    win: 1,
                    loss: 0
                  }
                } else {
                  list[part.summonerName] = {
                    win: 0,
                    loss: 1
                  }
                }
              } else {
                if (win) {
                  list[part.summonerName].win++
                } else {
                  list[part.summonerName].loss++
                }
              }
            }
          })
        } else if (team == "200" && match.outcome != "Remake") {
          await match.redTeam.forEach(part => {
            if (part.currentAccountId != profile.summoner.accountId) {
              if (!list[part.summonerName]) {
                if (win) {
                  list[part.summonerName] = {
                    win: 1,
                    loss: 0
                  }
                } else {
                  list[part.summonerName] = {
                    win: 0,
                    loss: 1
                  }
                }
              } else {
                if (win) {
                  list[part.summonerName].win++
                } else {
                  list[part.summonerName].loss++
                }
              }
            }
          })
        }
      })
      await Object.keys(list).asyncForEach(player => {
        var p = {
          name: player,
          total: list[player].win+list[player].loss,
          wins: list[player].win,
          losses: list[player].loss,
          percent: 0
        }
        p.percent = Math.round((p.wins/(p.wins+p.losses))*100)
        if (p.total > 1) players.push(p);
      })
      players.sort((a,b) => {
        return b.total - a.total
      })
      profile.recent.players = players;
      callback(profile)
    },
    async generateRecentChampions(profile, callback) {
      if (!profile.recent) profile.recent = {};
      profile.recent.champions = [];
      profile.recent.roles = [];
      var list = {
        role: {},
        champion: {}
      };
      await profile.matches.asyncForEach(match => {
        if (match.queueId.type != "Convergence" && match.outcome != "Remake" && match.role) {
          if (!list.role[match.role] && match.role) {
            if (match.queueId == "420" || match.queueId == "440") {
              list.role[match.role] = {
                total: 1,
                wins: (match.outcome == "Victory") ? 1 : 0,
                losses: (match.outcome == "Defeat") ? 1 : 0,
              }
            }
          } else if (match.queueId == "420" || match.queueId == "440") {
            if (match.outcome == "Victory") {
              list.role[match.role].wins++
              list.role[match.role].total++
            } else if (match.outcome == "Defeat") {
              list.role[match.role].losses++
              list.role[match.role].total++
            }
          }
          if (!list.champion[match.championId]) {
            list.champion[match.championId] = {
              total: 1,
              wins: (match.outcome == "Victory") ? 1 : 0,
              losses: (match.outcome == "Defeat") ? 1 : 0,
              kills: match.kills,
              deaths: match.deaths,
              assists: match.assists
            }
          } else {
            list.champion[match.championId].kills += match.kills
            list.champion[match.championId].deaths += match.deaths
            list.champion[match.championId].assists += match.assists
            if (match.outcome == "Victory") {
              list.champion[match.championId].wins++
              list.champion[match.championId].total++
            } else if (match.outcome == "Defeat") {
              list.champion[match.championId].losses++
              list.champion[match.championId].total++
            }
          }
        }
      })
      await Object.keys(list.role).asyncForEach(role => {
        var a = {
          name: role,
          total: list.role[role].total,
          wins: list.role[role].wins,
          losses: list.role[role].losses
        }
        profile.recent.roles.push(a)
      })
      await Object.keys(list.champion).asyncForEach(champ => {
        var total = list.champion[champ].total;
        var wins = list.champion[champ].wins;
        var losses = list.champion[champ].losses;
        var deaths = list.champion[champ].deaths;
        var assists = list.champion[champ].assists;
        var kills = list.champion[champ].kills;
        var a = {
          id: champ,
          total: total,
          wins: wins,
          losses: losses,
          kills: (kills/total).toFixed(1),
          deaths: (deaths/total).toFixed(1),
          assists: (assists/total).toFixed(1),
          kda: ((kills+assists)/deaths).toFixed(2),
          percent: Math.round((wins/total)*100)
        }
        profile.recent.champions.push(a)
      })
      profile.recent.champions.sort((a,b) => {
        return b.kda - a.kda;
      })
      profile.recent.champions.sort((a,b) => {
        return b.percent - a.percent;
      })
      profile.recent.champions.sort((a,b) => {
        return b.total - a.total;
      })
      profile.recent.roles.sort((a,b) => {
        return b.total - a.total;
      })
      await profile.recent.champions.asyncForEach((champ, i) => {
        if (champ.deaths == 0) profile.recent.champions[i].kda = "Perfect";
      })
      callback(profile)
    },
    async generateRecentStats(profile, callback) {
      if (!profile.stats) profile.stats = {};
      if (profile.matches.length > 0) {
        profile.stats.lastPlayed = champions["English"][profile.matches[0].championId].id
      }

      await this.calculateStreak(profile, updatedProfile => {
        profile = updatedProfile;
      })

      await this.calculateKda(profile, updatedProfile => {
        profile = updatedProfile;
      })
      callback(profile)
    },
    async generateRecentRanked(profile, options, callback) {
      var games = [];
      var recent = [];
      await MatchService.getRecentRanked(profile.summoner.accountId, options, retrievedMatches => {
        if (retrievedMatches) games = retrievedMatches;
      })
      if (games.length > 0) {
        var list = {};
        await this.formatMatches(profile.summoner, games, formatedMatches => {
          if (formatedMatches) games = formatedMatches
        })
        await games.asyncForEach(game => {
          if (!list[game.championId] && game.outcome != "Remake") {
            list[game.championId] = {};
            list[game.championId] = {
              wins: game.outcome == "Victory" ? 1 : 0,
              losses: game.outcome == "Defeat" ? 1 : 0
            }
          } else if (game.outcome != "Remake") {
            if (game.outcome == "Victory") {
              list[game.championId].wins++
            } else if (game.outcome == "Defeat"){
              list[game.championId].losses++
            }
          }
        })
        await Object.keys(list).asyncForEach(champ => {
          var wins = list[champ].wins;
          var losses = list[champ].losses
          var a = {
            id: champ,
            wins: wins,
            losses: losses,
            percent: Math.round((wins/(wins+losses))*100)
          }
          recent.push(a)
        })
        recent.sort((a,b) => {
          return b.percent - a.percent
        })
        recent.sort((a,b) => {
          return (b.wins+b.losses) - (a.wins+a.losses)
        })
        profile.recent.ranked = recent
      }
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
            matches[i].kda = ((part.stats.kills+part.stats.assists)/part.stats.deaths).toFixed(2)
            if (part.stats.deaths == 0) {
              matches[i].kda = "Perfect"
            }
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
      // translate top 5 champion ids
      if (profile.champions.total.length > 0) {
        await profile.champions.total.asyncForEach((champ, i) => {
          if (champions[language][champ.id]) {
            profile.champions.total[i].id = {
              id: champions[language][champ.id].id,
              name: champions[language][champ.id].name
            }
          }
        })
      }

      // translate recent ranked champion ids
      if (profile.recent.ranked) {
        await profile.recent.ranked.asyncForEach((champ, i) => {
          if (champions[language][champ.id]) {
            profile.recent.ranked[i].id = {
              id: champions[language][champ.id].id,
              name: champions[language][champ.id].name
            }
          }
        })
      }
      // translate recent champion ids
      if (profile.recent.champions.length > 0) {
        await profile.recent.champions.asyncForEach((champ, i) => {
          if (champions[language][champ.id]) {
            profile.recent.champions[i].id = {
              id: champions[language][champ.id].id,
              name: champions[language][champ.id].name
            }
          }
        })
      }
      // translate champions in matches
      if (profile.matches.length > 0) {
        await profile.matches.asyncForEach(async (match, i) => {
          profile.matches[i].queueId = {
            type: gameMode[profile.matches[i].queueId]["English"].type,
            description: gameMode[profile.matches[i].queueId]["English"].description,
            name: gameMode[profile.matches[i].queueId]["English"].name,
            id: gameMode[profile.matches[i].queueId]["id"],
            queue: gameMode[profile.matches[i].queueId]["queue"]
          }
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
      }
      callback(profile)
    },
    async format(profile, stat, callback) {
      if (!profile.champions) profile.champions = {};
      profile.champions.total = [];
      var championList = [];
      // update stats
      if (stat) {
        if (Object.keys(stat.champions).length > 0) {
          await Object.keys(stat.champions).asyncForEach(async champion => {
            var rankedStats = {
              games: 0,
              wins: 0,
              kills: 0,
              deaths: 0,
              assists: 0
            }
            await Object.keys(stat.champions[champion]).asyncForEach(queue => {
              if (queue != "norm") {
                rankedStats = {
                  games: rankedStats.games+stat.champions[champion][queue].games,
                  wins: rankedStats.wins+stat.champions[champion][queue].wins,
                  kills: rankedStats.kills+stat.champions[champion][queue].kills,
                  deaths: rankedStats.deaths+stat.champions[champion][queue].deaths,
                  assists: rankedStats.assists+stat.champions[champion][queue].assists
                }
              }
            })
            var games = rankedStats.games;
            var wins = rankedStats.wins;
            var kills = rankedStats.kills;
            var deaths = rankedStats.deaths;
            var assists = rankedStats.assists;
            var championStat = {
              id: champion,
              games: games,
              kills: (kills/games).toFixed(1),
              deaths: (deaths/games).toFixed(1),
              assists: (assists/games).toFixed(1),
              kda: ((kills+assists)/deaths).toFixed(2),
              winPercent: Math.round((wins/games).toFixed(2)*100)
            }
            if (deaths == 0) championStat.kda = "Perfect"
            championList.push(championStat)
          })
          championList.sort((a,b) => {
            return b.winPercent - a.winPercent;
          })
          championList.sort((a,b) => {
            return b.games - a.games;
          })
          if (championList.length <= 5) {
            profile.champions.total = championList
          } else {
            profile.champions.total = championList.slice(0, 5)
          }
        }
      }
      // trim matches
      await profile.matches.asyncForEach(async match => {
        delete match.teams;
        delete match.gameVersion;
        delete match.gameMode;
        delete match.gameType;
        delete match.mapId;
        delete match.seasonId;
        delete match.platformId;
        delete match._id;
        delete match.__v;
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
      // format leagues
      if (Object.keys(profile.leagues).length > 0) {
        await Object.keys(profile.leagues).asyncForEach(league => {
          delete profile.leagues[league].summonerName;
          delete profile.leagues[league].summonerId;
        })
      }
      callback(profile)
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
    async calculateKda(profile, callback) {
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
      if (totalDeaths == 0) {
        stats.kda = "Perfect";
      }
      profile.stats = {...profile.stats, ...stats};
      callback(profile)
    }
  }
}