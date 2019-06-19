import { Component, OnInit } from '@angular/core';
import { SummonerService } from '../summoner.service';
// Models
import { Summoner } from '../summoner.model';
import { Match } from './match.model';

@Component({
  selector: 'app-summoner-match-history',
  templateUrl: './summoner-match-history.component.html',
  styleUrls: ['./summoner-match-history.component.scss']
})
export class SummonerMatchHistoryComponent implements OnInit {
  matches: Match[] = [];
  summoner: Summoner;

  constructor(
    private summonerService: SummonerService
  ) { }

  ngOnInit() {
    this.summoner = this.summonerService.summoner;
  }
}
.