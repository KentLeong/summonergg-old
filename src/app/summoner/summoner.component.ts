import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SummonerService } from './summoner.service';

// components
import { SummonerMatchHistoryComponent } from './summoner-match-history/summoner-match-history.component';
import { SummonerDetailComponent } from './summoner-detail/summoner-detail.component';

// models
import { Summoner } from './summoner.model';
import { Match } from './summoner-match-history/match.model';
import { SummonerProfile } from './summonerProfile.model';

@Component({
  selector: 'app-summoner',
  templateUrl: './summoner.component.html',
  styleUrls: ['./summoner.component.scss']
})
export class SummonerComponent implements OnDestroy {
  navigationSubscription;
  summoner: Summoner;
  leagues: object[]= [];
  matches: Match[] = [];

  // css
  lastPlayed: String = "";

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
    var name = this.router.url.split("/")[2];
    this.getProfile(name);
  }
  
  ngOnDestroy() {
    if (this.navigationSubscription) this.navigationSubscription.unsubscribe();
  }

  updateSummoner() {
    this.updateProfile(this.summoner);
  }a

  getProfile(name: string) {
    this.summonerService.getProfile(name)
      .subscribe((profile: SummonerProfile) => {
        let difference = (new Date()).getTime() - new Date(profile.lastUpdated).getTime();
        // 30 minutes
        this.setProfile(profile);
        if (difference > 1800000) {
          this.updateProfile(profile.summoner);
        } else {
        }
      }, err => {
        this.newProfile(name)
      })
  }

  newProfile(name: string) {
    this.summonerService.summonerSearchByName(name)
      .subscribe((summoner: Summoner) => {
        if (summoner) return this.summoner = {...summoner, ...{found: "new"}};
        this.summoner = {...new Summoner(), ...{found: "none"}}
      })
  }

  setProfile(profile: SummonerProfile) {
    //matches profile
    profile.matches.forEach(match => {
      if (match.victory == "Victory") {
        match.bg = "#bee0eb"
      } else {
        match.bg = "#f0bcbc"
      }
    })

    this.lastPlayed = 'url("../../assets/champion/splash/'+profile.matches[0].championId+'_0.jpg")'
    this.matches = profile.matches;
    this.summoner = {...profile.summoner, ...{found: "local"}};
    this.leagues = profile.leagues;
  }

  updateProfile(summoner: Summoner) {
    this.summonerService.updateSummoner(summoner)
      .subscribe((summoner:Summoner) => {
        if (summoner) return this.summoner = {...summoner, ...{found: "update"}};
        this.summoner = {...new Summoner(), ...{profile: "none"}}
      })
  }

  matchUpdated(profile: SummonerProfile) {
    profile.leagues = this.details.leagues
    this.summonerService.newProfile(profile)
      .subscribe((profile: SummonerProfile) => {
        this.setProfile(profile)
      })
  }

}