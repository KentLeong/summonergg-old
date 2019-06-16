import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as config from '../../../config'
import { Observable } from 'rxjs';

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

  constructor(
    private http: HttpClient
  ) { }
  // check rate
  checkRate(rate: Number) {
    return this.http.put(this.protocal+"/api/rates/check",{rate: rate}, httpOptions)
  }

  // summoner
  summonerSearchByName(name: string) {
    return this.http.get(this.protocal+"/api/summoners/"+name)
  }

  newSummoner(summoner: object) {
    return this.http.post(this.protocal+"/api/summoners/", {summoner: summoner}, httpOptions)
  }

  updateSummoner(summoner: object) {
    return this.http.put(this.protocal+"/api/summoners/", {summoner: summoner}, httpOptions)
  }

  riotSummonerSearchByName(name: string) {
    return this.http.get(this.protocal+"/api/summoners/riot/by-name/"+name)
  }

  
  // league
  leagueSearchByName(name: string) {
    return this.http.get(this.protocal+"/api/leagues/by-name/"+name)
  }
  leagueSearchByID(id: string) {
    return this.http.get(this.protocal+"/api/leagues/"+id)
  }

  riotLeagueSearchBySummonerID(id: string) {
    return this.http.get(this.protocal+"/api/leagues/riot/by-id/"+id)
  }

  newLeague(league: object) {
    return this.http.post(this.protocal+"/api/leagues/", {league: league}, httpOptions)
  }
  updateLeague(league: object) {
    return this.http.put(this.protocal+"/api/leagues/", {league: league}, httpOptions) 
  }

  // match

  riotGetMatches(id: string, options: string) {
    return this.http.get(this.protocal+"/api/matches/riot/by-account/"+id+"/"+options)
  }
  
  riotGetMatchData(id: string) {
    return this.http.get(this.protocal+"/api/matches/riot/by-id/"+id)
  }

  getMatchData(id: string) {
    return this.http.get(this.protocal+"/api/matches/"+id)
  }

  newMatch(match: object) {
    return this.http.post(this.protocal+"/api/matches/", {match: match}, httpOptions)
  }
}
