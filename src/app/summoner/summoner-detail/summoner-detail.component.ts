import { Component, OnChanges, Input } from '@angular/core';
import { SummonerService } from '../summoner.service';

//models
import { Summoner } from '../summoner.model';
@Component({
  selector: 'app-summoner-detail',
  templateUrl: './summoner-detail.component.html',
  styleUrls: ['./summoner-detail.component.scss']
})
export class SummonerDetailComponent implements OnChanges {

  solo: object;
  flex_5v5: object;
  flex_3v3: object;
  
  constructor(
    private summonerService: SummonerService
  ) { }

  @Input() leagues: Object[];
  @Input() summoner: Summoner;

  ngOnChanges() {
    if (!this.summoner) return;
    if (this.summoner.found == "local") return;
    //execute if summoner founds
    if (this.summoner.found == "update") return this.update();
    this.getFromLocal();
  }
  
  update() {
  }
  getFromLocal() {
    this.summonerService.leagueSearchByID(this.summoner.id)
      .subscribe((leagues: any) => {
        this.sortLeagues(leagues);
      })
  }
  //algo
  sortLeagues(leagues: any[]) {
    this.leagues = [];
    leagues.forEach((league, i) => {
      league.winRatio = Math.round(100*(league.wins/(league.wins+league.losses)))
      this.leagues.push(league);
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
