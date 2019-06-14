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

  region: string = window.location.hostname.split(".")[0]

  constructor(
    private http: HttpClient
  ) { }

  // summoner
  summonerSearchByName(name: string) {
    return this.http.get(config.protocal+this.region+"."+config.host+"/api/summoners/"+name)
  }

  newSummoner(summoner: object) {
    return this.http.post(config.protocal+this.region+"."+config.host+"/api/summoners/", {summoner: summoner}, httpOptions)
  }

  riotSummonerSearchByName(name: string) {
    return this.http.get(config.protocal+this.region+"."+config.host+"/api/summoners/riot/by-name/"+name)
  }

  
  // league
  leagueSearchByName(name: string) {
    return this.http.get(config.protocal+this.region+"."+config.host+"/api/leagues/by-name/"+name)
  }
  leagueSearchByID(id: string) {
    return this.http.get(config.protocal+this.region+"."+config.host+"/api/leagues/"+id)
  }

  riotLeagueSearchByID(id: string) {
    return this.http.get(config.protocal+this.region+"."+config.host+"/api/leagues/riot/by-id/"+id)
  }

  newLeague(league: object) {
    return this.http.post(config.protocal+this.region+"."+config.host+"/api/leagues/", {league: league}, httpOptions)
  }
}
