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

  constructor(
    private router: Router,
    private summonerService: SummonerService
  ) {
    const routerEvents = router.events.subscribe(route => {
      if (route.toString().split("(")[0] == "NavigationEnd") {
        routerEvents.unsubscribe();
        var name = this.router.url.split("/")[2]
        this.summonerService.searchByName(name)
          .subscribe(data => {
            if (!data) {
              this.summonerService.riotSearchByName(name)
                .subscribe(data => {
                  this.summoner = data
                  this.summonerService.newSummoner(data)
                    .subscribe(data => {
                      console.log(data)
                    }, err => {
                      console.error(err)
                    })
                }, err => {
                  console.log(err)
                })
            } else {
              this.summoner = data
            }
          }, err => {
            console.log(err)
          })

      }
    }, err => console.error(err))
  }

  ngOnInit() {

  }
}
