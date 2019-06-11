import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as config from '../../../config'

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
  constructor(
    private http: HttpClient
  ) { }

  searchByName(name: string) {
    var region = window.location.hostname.split(".")[0]
    return this.http.get(config.protocal+region+"."+config.host+"/api/summoners/"+name)
  }

  newSummoner(summoner: object) {
    var region = window.location.hostname.split(".")[0]
    return this.http.post(config.protocal+region+"."+config.host+"/api/summoners/", {summoner: summoner}, httpOptions)
  }

  riotSearchByName(name: string) {
    var region = window.location.hostname.split(".")[0]
    return this.http.get(config.protocal+region+"."+config.host+"/api/summoners/riot/by-name/"+name)
  }
}
