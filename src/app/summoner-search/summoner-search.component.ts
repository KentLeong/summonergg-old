import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-summoner-search',
  templateUrl: './summoner-search.component.html',
  styleUrls: ['./summoner-search.component.scss']
})
export class SummonerSearchComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  searchSummoner(summoner:string) {
    if (summoner) {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigate(['/summoner/'+summoner])); 
    } 
  }

}
