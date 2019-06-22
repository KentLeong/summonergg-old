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
  profileFound: boolean = false;
  lastPlayed: string;
  navigationSubscription;
  profile;
  summoner: Summoner;
  leagues: object[]= [];
  matches: Match[] = [];
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
    this.getProfile(name);
  }
  
  ngOnDestroy() {
    if (this.navigationSubscription) this.navigationSubscription.unsubscribe();
  }

  updateSummoner() {
    this.matchHistory.update();
    this.details.update();
    this.summonerService.riotSummonerSearchByPUUID(this.summoner.puuid)
      .subscribe((summoner: Summoner) => {
        this.summoner = {...summoner, ...{profile: true}};
        this.profile.summoner = summoner;
      })
  }

  getProfile(name: string) {
    this.summonerService.getProfile(name)
      .subscribe((profile: any) => {
        this.profile = profile;
        this.matches = profile.matchHistory;
        this.summoner = {...profile.summoner, ...{found: true, profile: true}};
        this.leagues = profile.leagues;
        this.profileFound = true;
        this.lastPlayed = 'url("../../assets/champion/splash/'+this.matches[0].championId+'_0.jpg")'
      }, err => {
        this.getSummoner(name)
      })
  }

  checkProfile(event: any) {
    var matches = [];
    var leagues = [this.details.solo];
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
    var profile = {
      name: this.summoner.name,
      summoner: this.summoner,
      leagues: leagues,
      matches: matches
    }
    this.lastPlayed = 'url("../../assets/champion/splash/'+profile.matches[0].championId+'_0.jpg")'
    
    if (this.profileFound) {
      this.summonerService.updateProfile(profile)
        .subscribe((profile: SummonerProfile) =>{})
    } else {
      this.summonerService.newProfile(profile)
        .subscribe((profile: SummonerProfile) =>{})
    }
  }

  getSummoner(name: string) {
    this.summonerService.summonerSearchByName(name)
      .subscribe((summoner: Summoner) => {
        this.summoner = {...summoner, ...{found: true, profile: false}}
      }, err => {
        this.summonerService.riotSummonerSearchByName(name)
          .subscribe((summoner: Summoner) => {
            this.summonerService.newSummoner(summoner)
              .subscribe(summoner => {})
            this.summoner = {...summoner, ...{found: false, profile: false}}
          }, err => {
            console.log("summoner not found")
          })
      })
  }
}
