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
  
  @Input() matches: any[];
  @Output() clear = new EventEmitter();

  ngOnChanges() {
    console.log(this.matches)
  }

  initMatches() {
  }

  clearProfile() {
    this.clear.emit();
  }

  toggleMatch(match: Match) {
    if (match.showToggle) {
      match.toggle['grid-template-rows'] = '12rem 0rem';
    } else {
      match.toggle['grid-template-rows'] = '12rem 38rem';
    }
    console.log(match)
    match.showToggle = !match.showToggle;
  }
}