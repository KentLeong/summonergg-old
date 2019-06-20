import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SummonerService } from './summoner.service';

// components
import { SummonerMatchHistoryComponent } from './summoner-match-history/summoner-match-history.component';
import { SummonerDetailComponent } from './summoner-detail/summoner-detail.component';

// models
import { Summoner } from './summoner.model';

@Component({
  selector: 'app-summoner',
  templateUrl: './summoner.component.html',
  styleUrls: ['./summoner.component.scss']
})
export class SummonerComponent implements OnInit, OnDestroy {
  navigationSubscription;

  summoner: Summoner;
  /**
   * {
   *    summoner: Summoner;
   *    found: boolean;
   * }
   */

  constructor(
    private router: Router,
    private summonerService: SummonerService
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialise();
      }
    });
  }
  @ViewChild(SummonerMatchHistoryComponent) matchHistory;
  @ViewChild(SummonerDetailComponent) details;

  initialise() {
    // Set default values and re-fetch any data you need.
    this.summoner = null;
    var name = this.router.url.split("/")[2];
    this.getSummoner(name);
  }

  ngOnInit() {
  }
  
  ngOnDestroy() {
    if (this.navigationSubscription) this.navigationSubscription.unsubscribe();
  }

  updateSummoner() {
    this.matchHistory.update();
    this.details.update();
  }

  getSummoner(name: string) {
    var ssbm = this.summonerService.summonerSearchByName(name);
    var rssbm = this.summonerService.riotSummonerSearchByName(name);

    ssbm.subscribe((summoner: Summoner) => {
      if (summoner) return this.summoner = {...summoner, ...{found: true}}
      rssbm.subscribe((summoner: Summoner) => {
        if (!summoner) return console.log("summoner does not exist");
        this.summonerService.newSummoner(summoner)
          .subscribe(summoner => {})
        this.summoner = {...summoner, ...{found: false}}
      }, err => {console.log(err)})
    }, err => {console.log(err)})
  }

}
