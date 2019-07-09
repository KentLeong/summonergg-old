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
  @Input() flex_5v5: object;
  @Input() flex_3v3: object;

  ngOnChanges() {
  }
  
  update() {
  }
  getFromLocal() {
  }
}