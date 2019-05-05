import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
    return this.http.get("http://localhost:3000/api/summoners/"+name)
  }

  newSummoner(summoner: object) {
    return this.http.post("http://localhost:3000/api/summoners/", {summoner: summoner}, httpOptions)
  }

  riotSearchByName(name: string) {
    return this.http.get("http://localhost:3000/api/summoners/riot/by-name/"+name)
  }
}
