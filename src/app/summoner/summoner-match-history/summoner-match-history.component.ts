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
  
  @Input() profile: SummonerProfile;
  @Input() matches: any[];
  @Output() matchUpdated = new EventEmitter();

  ngOnChanges() {
    console.log(this.matches)
  }

  initMatches() {
  }

  update() {
  }
}