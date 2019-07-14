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
  
  constructor(
    private summonerService: SummonerService
  ) { }

  @Input() solo: object;
  @Input() flexSR: object;
  @Input() flexTT: object;

  ngOnChanges() {
  }
  
  update() {
  }
  getFromLocal() {
  }
}