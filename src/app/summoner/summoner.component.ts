import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
export class SummonerComponent implements OnInit, OnDestroy {
  navigationSubscription;
  getProfileSub;
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

  ngOnInit() {
  }
  
  ngOnDestroy() {
    if (this.navigationSubscription) this.navigationSubscription.unsubscribe();
    if (this.getProfileSub) this.getProfileSub.unsubscribe();
  }

  updateSummoner() {
    this.matchHistory.update();
    this.details.update();
  }

  getProfile(name: string) {
    this.getProfileSub = this.summonerService.getProfile(name)
      .subscribe((profile: any) => {
        this.profile = profile;
        this.matches = profile.matchHistory;
        this.summoner = {...profile.summoner, ...{found: true, profile: true}};
        this.leagues = profile.leagues;
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
        championName: match.championName
      })
    })
    var profile = {
      name: this.summoner.name,
      summoner: this.summoner,
      leagues: leagues,
      matches: matches
    }
    this.summonerService.newProfile(profile)
      .subscribe((profile: SummonerProfile) =>{})
  }

  getSummoner(name: string) {
    var ssbm = this.summonerService.summonerSearchByName(name);
    var rssbm = this.summonerService.riotSummonerSearchByName(name);

    ssbm.subscribe((summoner: Summoner) => {
      this.summoner = {...summoner, ...{found: true, profile: false}}
    }, err => {
      rssbm.subscribe((summoner: Summoner) => {
        this.summonerService.newSummoner(summoner)
          .subscribe(summoner => {})
        this.summoner = {...summoner, ...{found: false, profile: false}}
      }, err => {
        console.log("summoner not found")
      })
    })
  }
}
