import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { SummonerService } from '../summoner.service';
// Models
import { Summoner } from '../summoner.model';
import { Match } from './match.model';
import { SummonerProfile } from '../summonerProfile.model';
import { TemplateParseError } from '@angular/compiler';

@Component({
  selector: 'app-summoner-match-history',
  templateUrl: './summoner-match-history.component.html',
  styleUrls: ['./summoner-match-history.component.scss']
})
export class SummonerMatchHistoryComponent implements OnChanges {
  
  

  constructor(
    private summonerService: SummonerService
  ) { }

  @Input() matches: Match[] = [];
  @Input() summoner: Summoner;
  @Output() matchUpdated = new EventEmitter();

  ngOnChanges() {
    if (!this.summoner) return;
    if (this.summoner.found == "local") return;
    if (this.summoner.found == "update") return this.update();
    // execute if summoner found
    this.initMatches();
  }
  initMatches() {
    this.summonerService.initMatches(this.summoner.accountId)
      .subscribe((matches: Match[]) => {
        this.formatMatches(matches, profile => {
          this.matches = profile.matches
          this.matchUpdated.emit(profile)
        })
      })
  }

  update() {
    this.summonerService.initMatches(this.summoner.accountId)
      .subscribe(async (matches: Match[]) => {
        this.formatMatches(matches, profile => {
          var matches10 = this.matches.slice(0, 10);
          var temp = this.matches
          var found = false
          profile.matches.forEach(match => {
            matches10.some(compare => {
              if (compare.gameId == match.gameId) found = true;
              return compare.gameId == match.gameId;
            })
            if (!found) temp.push(match);
          })
          temp.sort((a,b):number => {
            return b.gameCreation - a.gameCreation;
          })
          setTimeout(()=>{
            this.matches = temp
          }, 1000)
          this.matchUpdated.emit(profile)
        })
      })
  }

  formatMatches(matches, callback){
    //condense matches
    var formatedMatches = [];
    matches.forEach((match: Match) => {
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
      formatedMatches.push({
        gameId: match.gameId,
        participants: part,
        victory: match.victory,
        role: match.role,
        championId: match.championId,
        championName: match.championName,
        spell1: match.spell1,
        spell2: match.spell2,
        perk1: match.perk1,
        perk2: match.perk2,
        gameCreation: new Date(match.gameCreation).getTime()
      })
    })

    var profile = new SummonerProfile({
      summoner: this.summoner,
      leagues: [],
      matches: formatedMatches
    })
    callback(profile)
  }

  // getMatches() {
  //   var options = "?championId=&seasonId=13&skip=0&limit=10";
    
  //   this.summonerService.getMatches(this.summoner.accountId, options)
  //     .subscribe((matches: Match[]) => {
  //       matches.forEach((match: Match) => {
  //         this.formatMatch(match).then((match: Match) => {
  //           this.matches.push(match)
  //           if (this.matches.length == 10) {
  //             this.matchUpdated.emit();
  //           }
  //         })
  //       })
  //     }, err => {
  //       console.log("no matches")
  //     })
  // }

  // getFromRiot() {
  //   var options = "beginIndex=0&endIndex=10&season=13&";

  //   this.summonerService.riotGetMatches(this.summoner.accountId, options)
  //       .subscribe((data: any) => {
  //         var matches = data.matches;
  //         matches.forEach((match: any, i: number) => {
  //           this.summonerService.getMatchData(match.gameId)
  //             .subscribe((match: Match) => {
  //               this.formatMatch(match).then(match => {
  //                 matches[i] = match
  //                 if (i+1 == 10) {
  //                   this.matches = matches;
  //                   this.matchUpdated.emit();
  //                 }
  //               })
  //             }, err => {
  //               this.summonerService.riotGetMatchData(match.gameId)
  //               .subscribe((match: Match) => {
  //                 this.summonerService.newMatch(match)
  //                   .subscribe((match: Match) => {
  //                     this.formatMatch(match).then(match => {
  //                       matches[i] = match
  //                       if (this.matches.length == 10) {
  //                         this.matches = matches;
  //                         this.matchUpdated.emit();
  //                       }
  //                     })
  //                   })
  //               })
  //             })
            
  //         })
  //       })
  // }

  // async formatMatch(match: Match) {
  //   await match.participants.some(p => {
  //     if (p.currentAccountId == this.summoner.accountId) {
  //       match.championId = p.championId;
  //       match.championName = p.championName;
  //       // calculate role;
  //       var role = p.timeline.role;
  //       var lane = p.timeline.lane;
  //       if (role == "DUO_CARRY") {
  //         match.role = "ADC"
  //       } else if (role == "DUO_SUPPORT") {
  //         match.role = "SUPPORT"
  //       } else if (role) {

  //       }
  //     }
  //     return p.currentAccountId == this.summoner.accountId
  //   })
  //   return match
  // }
}