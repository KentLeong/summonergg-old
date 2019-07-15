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

  getProfile(name: string) {
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
    this.summonerService.updateProfile(profile.summoner.puuid)
      .subscribe((profile: SummonerProfile) => {
        this.setProfile(profile)
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
    Object.keys(profile.leagues).forEach(league => {
      var leagueExists = Object.keys(profile.leagues[league]).length > 0;
      if (!leagueExists) delete profile.leagues[league];
    })
    profile.matches.forEach((match, i) => {
      // set game played
      this.timePlayed(match.gameCreation, match.gameDuration).then(played => {
        profile.matches[i].played = played
      })

      // find outcome of game
      match.showToggle = false;
      match.toggleContent = {'display': "none"};

      match.toggle = {};
      if (match.outcome == "Defeat") {
        match.main = {
          'background': 'linear-gradient(0deg, rgba(95,52,37,1) 0%, rgba(95,37,37,1) 100%)',
          'border-top': ".1rem #973f3f solid"
        }
        match.nav = {
          'background': "rgba(95,52,37,1)"
        }
      } else if (match.outcome == "Victory") {
        match.main = {
          'background': 'linear-gradient(0deg, rgba(37,78,95,1) 0%, rgba(37,57,95,1) 100%)',
          'border-top': '.1rem #345688 solid'
        }
        match.nav = {
          'background': "rgba(37,78,95,1)"
        }
      } else {
        match.main = {'filter': 'grayscale(.9)'}
        match.nav = {'background': "grey"}
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

  clearProfile() {
    this.summoner = new Summoner;
  }

  async timePlayed(gameCreation, gameDuration) {
    var lastPlayed = new Date(gameCreation).getTime();
    let playedMinutes = Math.floor(((new Date()).getTime() - lastPlayed)/60000);
    // playedMinutes = playedMinutes/60;
    console.log(playedMinutes)
    if (playedMinutes < 1) {
      return `few seconds ago`
    } else if (playedMinutes < 60) {
      if (playedMinutes == 1) {
        return `${playedMinutes} minute ago`
      } else {
        return `${playedMinutes} minutes ago`
      }
    } else if (playedMinutes < 1440) {
      let hours = Math.floor(playedMinutes/60)
      if (hours == 1) {
        return `${hours} hour ago`
      } else {
        return `${hours} hours ago`
      }
    } else if (playedMinutes < 40320){
      let days = Math.floor(playedMinutes/1440)
      if (days = 1) {
        return `${days} day ago`
      } else {
        return `${days} days ago`
      }
    } else {
      let month = Math.floor(playedMinutes/40320)
      if (month == 1) {
        return `${month} month ago`
      } else {
        return `${month} months ago`
      }
    }
  }
}