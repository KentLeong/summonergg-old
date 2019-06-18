import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SummonerService } from './summoner.service';

@Component({
  selector: 'app-summoner',
  templateUrl: './summoner.component.html',
  styleUrls: ['./summoner.component.scss']
})
export class SummonerComponent implements OnInit {

  summoner: any;

  constructor(
    private router: Router,
    private summonerService: SummonerService
  ) {
    const routerEvents = router.events.subscribe(route => {
      if (route.toString().split("(")[0] == "NavigationEnd") {
        routerEvents.unsubscribe();
        var name = this.router.url.split("/")[2]
        this.getSummoner(name)
      }
    }, err => console.error(err))
  }

  ngOnInit() {
    
  }
  
  updateSummoner() {
    var name = this.router.url.split("/")[2];
    //update summoner
    this.summonerService.checkRate(3).subscribe(ok => {
      if (!ok) {
        console.log("riot api limit reached")
      } else {
        this.summonerService.riotSummonerSearchByName(name).subscribe((data: any) => {
          this.summoner = data
          this.summonerService.updateSummoner(data).subscribe(data=>{},err=>{console.error(err)})
          this.summonerService.riotLeagueSearchBySummonerID(data.id).subscribe((data: any[]) => {
            data.forEach(league => {
              this.summonerService.updateLeague(league).subscribe(data=> {}, err => {console.error(err)})
            })
          })
        })
      }
    })
  }

  getSummoner(name: string) {
    this.summonerService.summonerSearchByName(name).subscribe(data => {
      if (!data) {
        this.summonerService.checkRate(2).subscribe(ok => {
          if (!ok) {
            console.log("riot api limit reached")
          } else {
            this.summonerService.riotSummonerSearchByName(name).subscribe(data => {
              this.summoner = data
              this.summonerService.summoner = data;
              this.summonerService.newSummoner(data).subscribe(data => {}, err => {console.error(err)})
            }, err => {console.log(err)})
          }
        })
      } else {
        this.summoner = data;
        this.summonerService.summoner = data;
      }
    }, err => {console.log(err)})
  }


}
