import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SummonerService } from './summoner.service';

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
  initialise() {
    // Set default values and re-fetch any data you need.
    this.summoner = null;
    var name = this.router.url.split("/")[2];
    this.getSummoner(name);
  }

  ngOnInit() {
  }
  
  ngOnDestroy() {
    if (this.navigationSubscription) {  
       this.navigationSubscription.unsubscribe();
    }
  }

  getSummoner(name: string) {
    var ssbm = this.summonerService.summonerSearchByName(name);
    var rssbm = this.summonerService.riotSummonerSearchByName(name);

    ssbm.subscribe((summoner: Summoner) => {
      if (summoner) return this.summoner = {...summoner, ...{found: true}}
      rssbm.subscribe((summoner: Summoner) => {
        if (!summoner) return console.log("summoner does not exist");
        this.summoner = {...summoner, ...{found: false}}
      }, err => {console.log(err)})
    }, err => {console.log(err)})
  }
}
