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
  getProfile(name: string) {
    return this.http.get(this.protocal+"/api/summonerProfiles/"+name);
  }

  newProfile(profile: SummonerProfile) {
    return this.http.post(this.protocal+"/api/summonerProfiles/", {profile: profile}, httpOptions)
  }

  updateProfile(profile: object) {
    return this.http.patch(this.protocal+"/api/summonerProfiles/", {profile: profile}, httpOptions)
  }

  // summoner
  summonerSearchByName(name: string) {
    return this.http.get(this.protocal+"/api/summoners/"+name);
  }

  updateSummoner(summoner: object) {
    return this.http.put(this.protocal+"/api/summoners/", {summoner: summoner}, httpOptions)
  }
  
  // league
  leagueSearchByName(name: string) {
    return this.http.get(this.protocal+"/api/leagues/by-name/"+name)
  }
  leagueSearchByID(id: string) {
    return this.http.get(this.protocal+"/api/leagues/"+id)
  }

  newLeague(league: object) {
    return this.http.post(this.protocal+"/api/leagues/", {league: league}, httpOptions)
  }
  updateLeague(league: object) {
    return this.http.put(this.protocal+"/api/leagues/", {league: league}, httpOptions) 
  }

  // match
  initMatches(id: string) {
    return this.http.get(this.protocal+"/api/matches/initialMatches/"+id)
  }

  // champion

  getChampionNameByKey(key: number) {
    return this.http.get(this.protocal+"/api/statics/champion/name-by-key/"+key)
  }
}
