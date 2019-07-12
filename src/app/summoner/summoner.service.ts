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
}
