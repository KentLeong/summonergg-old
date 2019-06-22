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
    if (this.summoner.found) return this.getFromLocal();
    this.getFromRiot();
  }

  update() {
    this.matches = null;
    this.matches = [];
    this.getFromRiot();
  }

  getFromLocal() {
    var options = "?championId=&seasonId=13&skip=0&limit=10";
    
    this.summonerService.getMatches(this.summoner.accountId, options)
      .subscribe((matches: Match[]) => {
        matches.forEach((match: Match) => {
          this.formatMatch(match).then((match: Match) => {
            this.matches.push(match)
            if (this.matches.length == 10) {
              this.matchUpdated.emit();
            }
          })
        })
      }, err => {
        console.log("no matches")
      })
  }

  getFromRiot() {
    var options = "beginIndex=0&endIndex=10&season=13&";

    this.summonerService.riotGetMatches(this.summoner.accountId, options)
        .subscribe((data: any) => {
          data.matches.forEach((match: any) => {
            this.summonerService.getMatchData(match.gameId)
              .subscribe((match: Match) => {
                this.formatMatch(match).then(match => {
                  this.matches.push(match)
                  if (this.matches.length == 10) {
                    this.matchUpdated.emit();
                  }
                })
              }, err => {
                this.summonerService.riotGetMatchData(match.gameId)
                .subscribe((match: Match) => {
                  this.summonerService.newMatch(match)
                    .subscribe((match: Match) => {
                      this.formatMatch(match).then(match => {
                        this.matches.push(match)
                        if (this.matches.length == 10) {
                          this.matchUpdated.emit();
                        }
                      })
                    })
                })
              })
            
          })
        })
  }

  async formatMatch(match: Match) {
    await match.participants.some(p => {
      if (p.currentAccountId == this.summoner.accountId) {
        match.championId = p.championId;
        match.championName = p.championName;
      }
      return p.currentAccountId == this.summoner.accountId
    })
    return match
  }

  sort() {
    this.matches.sort((a,b): number => {
      var d1 = new Date(a.gameCreation).getTime();
      var d2 = new Date(b.gameCreation).getTime();
      return d2 - d1;
    })
  }
}