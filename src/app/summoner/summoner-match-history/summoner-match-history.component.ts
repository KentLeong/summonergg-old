import { Component, OnInit } from '@angular/core';
import { SummonerService } from '../summoner.service';
// Models
import { Match } from './match.model';

@Component({
  selector: 'app-summoner-match-history',
  templateUrl: './summoner-match-history.component.html',
  styleUrls: ['./summoner-match-history.component.scss']
})
export class SummonerMatchHistoryComponent implements OnInit {
  matches: Match[] = [];
  summoner: any;

  constructor(
    private summonerService: SummonerService
  ) { }

  ngOnInit() {
    this.summoner = this.summonerService.summoner;
    this.getMatches(this.summoner, false);
  }

  getMatches(summoner: any, found: boolean) {
    var options;
    if (found) {
      options = {
        championId: "",
        skip: 0,
        limit: 10,
        seasonid: 13
      }
      this.summonerService.getMatches(summoner.accountId, options).subscribe((matches: any[]) => {
        matches.forEach(match => {
          this.sortMatches(match)
        })
      })
    } else {
      options = "beginIndex=0&endIndex=10&";
      this.summonerService.riotGetMatches(summoner.accountId, options).subscribe((data: any) => {
        var matches = data.matches
        matches.forEach(match => {
          this.summonerService.getMatchData(match.gameId).subscribe((data: Match) => {
          this.sortMatches(data)
          }, err => {
            this.summonerService.checkRate(1).subscribe(ok => {
              this.summonerService.riotGetMatchData(match.gameId).subscribe((data: Match) => {
                this.summonerService.newMatch(data).subscribe(data=>{},err=>{console.error(err)});
                this.sortMatches(data)
              })
            }, err => {
              console.log("riot api reached")
            }) 
          })
        })
      })
    }
  }

  sortMatches(match: Match) {
    match.participants.forEach(participant => {
      if (this.summoner.accountId == participant.currentAccountId) {
        match.championId = participant.championId;
        match.championName = participant.championName;
      }
    })
    console.log(match)
    this.matches.push(match)
    this.matches.sort((a:any, b:any): any => {
      return a.gameCreation - b.gameCreation
    });
  }
}
