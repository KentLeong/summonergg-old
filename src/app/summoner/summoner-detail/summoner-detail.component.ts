import { Component, OnChanges, Input } from '@angular/core';
import { SummonerService } from '../summoner.service';

//models
import { Summoner } from '../summoner.model';
@Component({
  selector: 'app-summoner-detail',
  templateUrl: './summoner-detail.component.html',
  styleUrls: ['./summoner-detail.component.scss']
})
export class SummonerDetailComponent implements OnChanges {

  solo: object;
  flex_5v5: object;
  flex_3v3: object;
  
  constructor(
    private summonerService: SummonerService
  ) { }

  @Input() leagues: Object[];
  @Input() summoner: Summoner;

  ngOnChanges() {
  }
  
  update() {
  }
  getFromLocal() {
  }
}