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
    this.summonerService.summonerSearchByName(name).subscribe((summoner: Summoner) => {
      if (summoner) {
        this.summonerFound(summoner)
      } else {
        this.summonerService.riotSummonerSearchByName(name).subscribe((summoner: Summoner) => {
          if (summoner) {
            this.summonerFound(summoner)
          } else {
            console.log("summoner does not exist")
          }
        }, err => {
          console.log(err)
        })
      }
    }, err => {
      console.log(err)
    })
  }

  summonerFound(summoner: Summoner) {
    this.summoner = summoner;
    this.summonerService.summoner = summoner;
  }
}
