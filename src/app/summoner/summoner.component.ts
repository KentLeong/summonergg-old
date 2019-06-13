import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SummonerService } from './summoner.service';

@Component({
  selector: 'app-summoner',
  templateUrl: './summoner.component.html',
  styleUrls: ['./summoner.component.scss']
})
export class SummonerComponent implements OnInit {

  summoner: object;
  leagues: object;

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

  getSummoner(name: string) {
    this.summonerService.summonerSearchByName(name).subscribe(data => {
      if (!data) {
        this.summonerService.riotSummonerSearchByName(name).subscribe(data => {
          this.summoner = data
          this.getLeague(this.summoner)
          this.summonerService.newSummoner(data).subscribe(data => {
          }, err => {
            console.error(err)
          })
        }, err => {
          console.log(err)
        })
      } else {
        this.summoner = data
        this.getLeague(this.summoner)
      }
    }, err => {
      console.log(err)
    })
  }

  getLeague(summoner: any) {
    console.log(summoner)
    this.summonerService.leagueSearchByID(summoner.id).subscribe((data: any[]) => {
      if (data.length == 0) {
       this.summonerService.riotLeagueSearchByID(summoner.id).subscribe((data: any[]) => {
        console.log(data)
       })
      } else {

      }
    }, err=>{console.error(err)})
  }
}
