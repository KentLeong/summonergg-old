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
  profile: SummonerProfile;
  summoner: Summoner;
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
  }

  getProfile(name: string) {
    this.summonerService.getProfile(name)
      .subscribe((profile: SummonerProfile) => {
        var lastUpdated = new Date(profile.lastUpdated).getTime();
        let minutes = ((new Date()).getTime() - lastUpdated)/60000;

        this.setProfile(profile);
        // Update profile if 30 minutes past since last update;
        if (minutes > 30) {
          this.updateProfile(profile.summoner);
        }
      }, res => {
        if (res.error == "not found") {
          this.newProfile(name)
        } else {
          console.error(res) 
        }
      })
  }

  newProfile(name: string) {
    this.summonerService.newProfile(name)
      .subscribe((profile: SummonerProfile) => {
        this.setProfile(profile)
      })
  }

  setProfile(profile: SummonerProfile) {
    this.lastPlayed = 'url("../../assets/champion/splash/'+profile.matches[0].championId+'_0.jpg")'
    console.log(profile)
    this.profile = profile;
  }

  updateProfile(summoner: Summoner) {
    this.summonerService.updateProfile(summoner)
      .subscribe((profile: SummonerProfile) => {
        this.setProfile(profile)
      })
  }

  matchUpdated() {
  }

}