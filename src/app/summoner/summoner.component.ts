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
    this.summonerService.getProfile(name, "English")
      .subscribe((profile: SummonerProfile) => {
        var lastUpdated = new Date(profile.lastUpdated).getTime();
        let minutes = ((new Date()).getTime() - lastUpdated)/60000;

        this.setProfile(profile);
        // Update profile if 30 minutes past since last update;
        if (minutes > 60) this.generateProfile(name);
      }, res => {
        if (res.error == "not found") {
          this.generateProfile(name)
        } else {
          console.error(res) 
        }
      })
  }

  generateProfile(name: string) {
    this.summonerService.generateProfile(name)
      .subscribe((profile: SummonerProfile) => {
        this.setProfile(profile)
      })
  }

  setProfile(profile: SummonerProfile) {
    if (!profile.leagues) profile.leagues = {};
    this.lastPlayed = 'url("../../assets/champion/splash/'+profile.matches[0].championId.id+'_0.jpg")'

    profile.matches.forEach(match => {
      // find outcome of game
      if (match.outcome == "Victory") {
        match.bg = "#5f2525"
        match.highlight = ".1rem #973f3f solid"
      } else {
        match.bg = "#253c5f"
        match.highlight = ".1rem #345688 solid"
      }
      // find summmoner in players and make bold
      match.blueTeam.forEach((player: any) => {
        if (player.summonerName == profile.summoner.name) {
          player.weight = 700
        } else {
          player.weight = 500
        }
      })
      match.redTeam.forEach((player: any) => {
        if (player.summonerName == profile.summoner.name) {
          player.weight = 700
        } else {
          player.weight = 500
        }
      })
    })
    console.log(profile)
    this.profile = profile;
  }

  matchUpdated() {
  }

}