import { Component, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SummonerService } from './summoner.service';

// components
import { SummonerMatchHistoryComponent } from './summoner-match-history/summoner-match-history.component';
import { SummonerDetailComponent } from './summoner-detail/summoner-detail.component';

// models
import { Summoner } from './summoner.model';
import { Match } from './summoner-match-history/match.model';
import { SummonerProfile } from './summonerProfile.model';
import { ProfileStyle } from './profileStyle.model';
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
  styles: ProfileStyle;
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

  @HostListener('window:scroll', ['$event'])
  doSomething(event) {
    //scroll event
  }
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
    this.summonerService.getProfile(name, "English")
      .subscribe((profile: SummonerProfile) => {
        this.setProfile(profile);
      }, res => {
        if (res.error == "not found") {
          // this.generateProfile(name)
        } else {
          console.error(res) 
        }
      })
  }

  async updateProfile(profile: SummonerProfile) {
    const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
    this.styles.update.style = {
      'width': "5rem",
      'filter': "hue-rotate(0deg)"
    }
    var wordLen = this.styles.update.action.length - 1
    this.styles.update.action = "Updat"
    await waitFor(360/wordLen);
    this.styles.update.action = "Upda"
    await waitFor(360/wordLen);
    this.styles.update.action = "Upd"
    await waitFor(360/wordLen);
    this.styles.update.action = "Up"
    await waitFor(360/wordLen);
    this.styles.update.action = "U"
    await waitFor(360/wordLen);
    this.styles.update.action = ""
    this.styles.update.show = {
      'display': "inline-block"
    };

    this.summonerService.updateProfile(profile.summoner.puuid, "English")
      .subscribe(async (profile: SummonerProfile) => {
        this.setProfile(profile)
        this.styles.update.show = {
          'display': "none"
        };
        this.styles.update.style = {
          'width': "9.5rem",
          'filter': "hue-rotate(-80deg)"
        }
        var wordLen = "Updated".length - 1
        this.styles.update.action = "U"
        await waitFor(360/wordLen);
        this.styles.update.action = "Up"
        await waitFor(360/wordLen);
        this.styles.update.action = "Upd"
        await waitFor(360/wordLen);
        this.styles.update.action = "Upda"
        await waitFor(360/wordLen);
        this.styles.update.action = "Updat"
        await waitFor(360/wordLen);
        this.styles.update.action = "Update"
        await waitFor(360/wordLen);
        this.styles.update.action = "Updated"
        this.styles.update.updated = "a few seconds ago"
      })
  }

  searchLive(profile: SummonerProfile) {
    // this.styles.live.show = {
    //   'display': "inline-block"
    // };
    // this.styles.live.style = {}
    // this.styles.live.action = "Searching"
  }

  generateProfile(name: string) {
    this.summonerService.generateProfile(name, "English")
      .subscribe((profile: SummonerProfile) => {
        this.setProfile(profile)
      })
  }

  setProfile(profile: SummonerProfile) {
    // format stats
    var styles = {
      update: {
        style: {},
        action: "Update",
        show: {
          'display': "none"
        },
        updated: ""
      },
      live: {
        style: {},
        action: "Live",
        show: {
          'display': "none"
        }
      }
    }
    this.summonerService.formatProfile(profile, styles, (updatedProfile: SummonerProfile, updatedStyles: ProfileStyle) => {
      this.profile = updatedProfile
      this.styles = updatedStyles
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