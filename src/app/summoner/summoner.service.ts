import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

//models
import { Summoner } from './summoner.model';
import { Match } from './summoner-match-history/match.model';
import { SummonerProfile } from './summonerProfile.model';

import * as config from '../../../config'
// import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    "Authorization": "my-auth-token"
  })
}

@Injectable({
  providedIn: 'root'
})

export class SummonerService {
  region: string = window.location.hostname.split(".")[0];
  protocal: string = config.protocal+this.region+"."+config.host;
  profile: SummonerProfile;

  constructor(
    private http: HttpClient
  ) { }

  // check rate
  checkRate(rate: Number) {
    return this.http.put(this.protocal+"/api/rates/check",{rate: rate}, httpOptions)
  }

  // profile
  getProfile(name: string, language: string) {
    return this.http.get(this.protocal+"/api/summonerProfiles/"+name+"?language="+language);
  }

  generateProfile(name: string) {
    return this.http.post(this.protocal+"/api/summonerProfiles/generateProfile", {name: name}, httpOptions);
  }
  retrieveMatches(accountId: string) {
    return this.http.get(this.protocal+"/api/summonerProfiles/retrieveMatches/"+accountId)
  }
  updateProfile(puuid: string) {
    return this.http.put(this.protocal+"/api/summonerProfiles/updateProfile/", {puuid: puuid}, httpOptions);
  }


  // profile formating main
  async formatProfile(profile, callback) {
    this.profile = profile;
    if (!this.profile.leagues) this.profile.leagues = {};
    this.profile.stats = {};
    await this.generalStats();
    await this.formatMatches();
    await this.deleteEmptyLeagues();
    await this.calculateStreak();
    await this.calculateKda();
    callback(this.profile)
  }
  async generalStats() {

    // set Last Played
    this.profile.stats.lastPlayed = this.profile.matches[0].championId.id
  }
  async calculateKda() {
    var totalKills = 0;
    var totalAssists = 0;
    var totalDeaths = 0;
    var totalMatches = this.profile.matches.length;
    var totalWins = 0;
    var totalLosses = 0;
    this.profile.matches.forEach((match: Match) => {
      totalKills += match.kills;
      totalAssists += match.assists;
      totalDeaths += match.deaths;
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
      kda: ((totalKills+totalAssists)/totalDeaths).toFixed(2)
    }
    this.profile.stats = {...this.profile.stats, ...stats};
  }

  async formatMatches() {
    this.profile.matches.forEach((match, i) => {
      // set game played
      this.timePlayed(match.gameCreation, played => {
        this.profile.matches[i].played = played
      })

      // find outcome of game
      match.showToggle = false;
      match.toggleContent = {'display': "none"};

      match.toggle = {};
      if (match.outcome == "Defeat") {
        match.main = {
          'background': 'linear-gradient(0deg, rgba(95,52,37,1) 0%, rgba(95,37,37,1) 100%)',
          'border-top': ".1rem #973f3f solid"
        }
        match.nav = {
          'background': "rgba(95,52,37,1)"
        }
      } else if (match.outcome == "Victory") {
        match.main = {
          'background': 'linear-gradient(0deg, rgba(37,78,95,1) 0%, rgba(37,57,95,1) 100%)',
          'border-top': '.1rem #345688 solid'
        }
        match.nav = {
          'background': "rgba(37,78,95,1)"
        }
      } else {
        match.main = {'filter': 'grayscale(.9)'}
        match.nav = {'background': "grey"}
      }

      // find summmoner in players and make bold
      match.blueTeam.forEach((player: any) => {
        if (player.summonerName == this.profile.summoner.name) {
          player.weight = 700
        } else {
          player.weight = 500
        }
      })
      match.redTeam.forEach((player: any) => {
        if (player.summonerName == this.profile.summoner.name) {
          player.weight = 700
        } else {
          player.weight = 500
        }
      })
    })
  }

  // delete empty leagues
  async deleteEmptyLeagues() {
    Object.keys(this.profile.leagues).forEach(league => {
      var leagueExists = Object.keys(this.profile.leagues[league]).length > 0;
      if (!leagueExists) delete this.profile.leagues[league];
    })
  }
  // profile format functions
  async calculateStreak() {
    this.profile.stats.streak = {
      outcome: "",
      num: 0 
    };
    this.profile.matches.some((match, i) => {
      var end = false;
      if (match.outcome != "Remake") {
        if (match.outcome == "Victory") {
          if (this.profile.stats.streak.outcome == "") {
            this.profile.stats.streak.outcome = "Win";
            this.profile.stats.streak.num++;
          } else if (this.profile.stats.streak.outcome == "Win") {
            this.profile.stats.streak.num++;
          } else {
            end = true;
          }
        }
        if (match.outcome == "Defeat") {
          if (this.profile.stats.streak.outcome == "") {
            this.profile.stats.streak.outcome = "Loss";
            this.profile.stats.streak.num++;
          } else if (this.profile.stats.streak.outcome == "Loss") {
            this.profile.stats.streak.num++;
          } else {
            end = true;
          }
        }
      }
      return end
    })
  }

  timePlayed(gameCreation, callback) {
    var lastPlayed = new Date(gameCreation).getTime();
    let playedMinutes = Math.floor(((new Date()).getTime() - lastPlayed)/60000);
    var played = "";
    if (playedMinutes < 1) {
      played = `few seconds ago`
    } else if (playedMinutes < 60) {
      if (playedMinutes == 1) {
        played = `${playedMinutes} minute ago`
      } else {
        played = `${playedMinutes} minutes ago`
      }
    } else if (playedMinutes < 1440) {
      let hours = Math.floor(playedMinutes/60)
      if (hours == 1) {
        played = `${hours} hour ago`
      } else {
        played = `${hours} hours ago`
      }
    } else if (playedMinutes < 40320){
      let days = Math.floor(playedMinutes/1440)
      if (days = 1) {
        played = `${days} day ago`
      } else {
        played = `${days} days ago`
      }
    } else {
      let month = Math.floor(playedMinutes/40320)
      if (month == 1) {
        played = `${month} month ago`
      } else {
        played = `${month} months ago`
      }
    }
    callback(played)
  }
}
