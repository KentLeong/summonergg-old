import { Component, Input, OnChanges } from '@angular/core';
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
  
  matches: Match[] = [];

  constructor(
    private summonerService: SummonerService
  ) { }

  @Input() summoner: Summoner;

  ngOnChanges(changes) {
    if (!this.summoner) return;
    // execute if summoner found
    var options = "?championId=&seasonId=13&skip=0&limit=10";
    this.summonerService.getMatches(this.summoner.accountId, options)
      .subscribe((matches: Match[]) => {
        this.formatMatch(matches)
      })
  }

  formatMatch(matches: Match[]) {
    var sortMatches = async function(summoner: Summoner) {
      await matches.forEach((match: Match) => {
        match.participants.forEach(p => {
          if (p.currentAccountId == summoner.accountId) {
            match.championId = p.championId;
            match.championName = p.championName;
          }
        })
      })
      await matches.sort((a,b): number => {
        var d1 = new Date(a.gameCreation).getTime();
        var d2 = new Date(b.gameCreation).getTime();
        return d2 - d1;
      })
      return matches;

    }
    sortMatches(this.summoner).then(matches => {
      this.matches = matches
    })
  }
}