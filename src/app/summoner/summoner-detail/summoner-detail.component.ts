import { Component, OnInit } from '@angular/core';
import { SummonerService } from '../summoner.service';

@Component({
  selector: 'app-summoner-detail',
  templateUrl: './summoner-detail.component.html',
  styleUrls: ['./summoner-detail.component.scss']
})
export class SummonerDetailComponent implements OnInit {
  summoner: any;

  solo: object;
  flex_5v5: object;
  flex_3v3: object;

  constructor(
    private summonerService: SummonerService
  ) { }

  ngOnInit() {
    this.summoner = this.summonerService.summoner;
    this.getLeague(this.summoner, true)
  }

  

  getLeague(summoner: any, found: boolean) {
    this.summonerService.leagueSearchByID(summoner.id).subscribe((data: any[]) => {
      if (data.length == 0 && !found) {
        this.summonerService.riotLeagueSearchBySummonerID(summoner.id).subscribe((data: any[]) => {
          if (data.length != 0) {
            this.sortLeagues(data)
            data.forEach(league => {
              this.summonerService.newLeague(league).subscribe(data => {}, err=> {console.error(err)})
            })
          }
        })
      } else {
        this.sortLeagues(data)
      }
    }, err=>{console.error(err)})
  }
  
  //algo
  sortLeagues(leagues: any[]) {
    leagues.forEach(league => {
      league.winRatio = Math.round(100*(league.wins/(league.wins+league.losses)))
      league.tier = league.tier.toLowerCase();
      if (league.queueType == "RANKED_SOLO_5x5") {
        this.solo = league
      } else if (league.queueType == "RANKED_FLEX_SR") {
        this.flex_5v5 = league
      } else if (league.queueType == "RANKED_FLEX_TT") {
        this.flex_3v3 = league
      }
    })
  }
}
