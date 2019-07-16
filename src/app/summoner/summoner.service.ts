import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

//models
import { Summoner } from './summoner.model';
import { Match } from './summoner-match-history/match.model';

import * as config from '../../../config'
import { SummonerProfile } from './summonerProfile.model';
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
  summoner: Summoner;
  matches: Match[];
  region: string = window.location.hostname.split(".")[0];
  protocal: string = config.protocal+this.region+"."+config.host;

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
  formatProfile(profile, callback) {
    if (!profile.leagues) profile.leagues = {};
    profile.stats = {};
    // set Last Played
    profile.stats.lastPlayed = profile.matches[0].championId.id

    this.formatMatches(profile, updatedProfile => {
      profile = updatedProfile;
    })
    this.deleteEmptyLeagues(profile.leagues, updatedLeagues => {
      profile.leagues = updatedLeagues;
    })
    this.calculateStreak(profile, updatedProfile => {
      profile = updatedProfile;
    })
    callback(profile)
  }

  formatMatches(profile: SummonerProfile, callback) {
    profile.matches.forEach((match, i) => {
      // set game played
      this.timePlayed(match.gameCreation, played => {
        profile.matches[i].played = played
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
        if (player.summonerName == profile.summoner.name) {
          player.weight = 700
        } else {
          player.weight = 500
        }
      })
      match.redTeam.forEach((player: any) => {
        if (player.summonerName == profile.summoner.name) {
          player.weight = 700
        } else {
          player.weight = 500
        }
      })
      callback(profile)
    })
  }

  // delete empty leagues
  deleteEmptyLeagues(leagues, callback) {
    Object.keys(leagues).forEach(league => {
      var leagueExists = Object.keys(leagues[league]).length > 0;
      if (!leagueExists) delete leagues[league];
    })
    callback(leagues)
  }
  // profile format functions
  calculateStreak(profile: SummonerProfile, callback) {
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
