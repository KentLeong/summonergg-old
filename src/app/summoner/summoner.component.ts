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
    this.matchHistory.update();
    this.details.update();
  }

  getProfile(name: string) {
    this.summonerService.getProfile(name)
      .subscribe((profile: SummonerProfile) => {
        let difference = (new Date()).getTime() - new Date(profile.lastUpdated).getTime();
        // 30 minutes
        if (difference > 1800000) {
          this.updateProfile(profile);
        } else {
          this.formatProfile(profile, {refresh: true});
        }
      }, err => {
        this.newProfile(name)
      })
  }

  newProfile(name: string) {
    this.summonerService.summonerSearchByName(name)
      .subscribe((summoner: Summoner) => {
        if (summoner) return this.summoner = {...summoner, ...{profile: false}};
        this.summoner = {...new Summoner(), ...{profile: false}}
      })
  }

  formatProfile(profile: SummonerProfile, option: any) {
    if (option.refresh) {
      this.matches = profile.matches;
      this.summoner = {...profile.summoner, ...{profile: true}};
      this.leagues = profile.leagues;
    }

    this.lastPlayed = 'url("../../assets/champion/splash/'+profile.matches[0].championId+'_0.jpg")'
  }

  updateProfile(profile: SummonerProfile) {
    console.log("updating")
  }

  matchUpdated() {
    //condense matches
    var matches = [];
    this.matchHistory.matches.forEach((match: Match) => {
      var part = [];
      match.participants.forEach(p => {
        part.push({
          championId: p.championId,
          championName: p.championName,
          currentAccountId: p.currentAccountId,
          summonerId: p.summonerId,
          summonerName: p.summonerName
        })
      })
      matches.push({
        gameId: match.gameId,
        participants: part,
        championId: match.championId,
        championName: match.championName,
        gameCreation: match.gameCreation
      })
    })
    
    var profile = new SummonerProfile({
      summoner: this.summoner,
      leagues: this.details.leagues,
      matches: matches
    })
    this.summonerService.newProfile(profile)
      .subscribe((profile: SummonerProfile) => {
        this.formatProfile(profile, {refresh: false})
      })
  }

}