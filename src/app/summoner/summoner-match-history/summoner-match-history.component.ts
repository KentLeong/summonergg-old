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
  @Output() clear = new EventEmitter();

  ngOnChanges() {
    console.log(this.profile.matches)
  }

  initMatches() {
  }

  clearProfile() {
    this.clear.emit();
  }

  toggleMatch(match: Match) {
    if (match.showToggle) {
      match.toggle['grid-template-rows'] = '12rem 0rem';
      match.toggleContent['display'] = "none";
    } else {
      match.toggle['grid-template-rows'] = '12rem 66rem';
      match.toggleContent['display'] = "block";
    }
    console.log(match)
    match.showToggle = !match.showToggle;
  }
}