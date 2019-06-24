import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { SummonerService } from '../summoner.service';
// Models
import { Summoner } from '../summoner.model';
import { Match } from './match.model';

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
    if (this.summoner.profile) return;
    // execute if summoner found
    this.initMatches(this.summoner.accountId);
  }
  initMatches(id: string) {
    this.summonerService.initMatches(id)
      .subscribe((matches: Match[]) => {
        this.matches = matches
        this.matchUpdated.emit()
      })
  }

  update() {
    this.matches = null;
    this.matches = [];
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