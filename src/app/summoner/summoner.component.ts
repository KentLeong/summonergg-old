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
import * as pData from '../../../data.js';
import championOffset from '../../assets/championSplashPositions.json';

@Component({
  selector: 'app-summoner',
  templateUrl: './summoner.component.html',
  styleUrls: ['./summoner.component.scss']
})
export class SummonerComponent implements OnDestroy {
  navigationSubscription;
  profile: SummonerProfile;
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
  @ViewChild(SummonerMatchHistoryComponent) matchHistory;
  @ViewChild(SummonerDetailComponent) details;

  initialise() {
    // Set default values and re-fetch any data you need.
    var name = this.router.url.split("/")[2];
    // this.profile = pData
    // console.log(this.profile)
    this.getProfile(name);
  }
  
  ngOnDestroy() {
    if (this.navigationSubscription) this.navigationSubscription.unsubscribe();
  }

  getProfile(name: string) {
    console.log(name)
    this.summonerService.getProfile(name, "English")
      .subscribe((profile: SummonerProfile) => {
        this.setProfile(profile);
      }, res => {
        if (res.error == "not found") {
          this.generateProfile(name)
        } else {
          console.error(res) 
        }
      })
  }

  updateProfile(profile: SummonerProfile) {
    this.summonerService.updateProfile(profile.summoner.puuid, "English")
      .subscribe((profile: SummonerProfile) => {
        this.setProfile(profile)
      })
  }

  generateProfile(name: string) {
    this.summonerService.generateProfile(name, "English")
      .subscribe((profile: SummonerProfile) => {
        this.setProfile(profile)
      })
  }

  setProfile(profile: SummonerProfile) {
    // format stats
    this.summonerService.formatProfile(profile, (updatedProfile: SummonerProfile) => {
      this.profile = updatedProfile
    })
    console.log(profile)
    this.profile = profile;
  }

  matchUpdated() {
  }

  clearProfile() {
    this.summoner = new Summoner;
  }

  getChampionOffset(champion) {
    var style = {
      'top': championOffset[champion][0]+1+"rem"
    }
    return style;
  }
}