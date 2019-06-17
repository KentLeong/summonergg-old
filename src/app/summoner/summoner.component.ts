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
  solo: object;
  flex_5v5: object;
  flex_3v3: object;
  matches: object[] = [];

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
            this.sortLeagues(data)
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
              this.getLeague(this.summoner, false)
              this.getMatches(this.summoner);
              this.summonerService.newSummoner(data).subscribe(data => {}, err => {console.error(err)})
            }, err => {console.log(err)})
          }
        })
      } else {
        this.summoner = data;
        this.getLeague(this.summoner, true);
        this.getMatches(this.summoner);
      }
    }, err => {console.log(err)})
  }

  getLeague(summoner: any, found: boolean) {
    this.summonerService.leagueSearchByID(summoner.id).subscribe((data: any[]) => {
      if (data.length == 0 && !found) {
        this.summonerService.riotLeagueSearchBySummonerID(summoner.id).subscribe((data: any[]) => {
          if (data.length != 0) {
            this.sortLeagues(data)
            data.forEach(league => {
              this.summonerService.newLeague(league).subscribe(data => {}, err=> {console.error(err)})
            })
          }
        })
      } else {
        this.sortLeagues(data)
      }
    }, err=>{console.error(err)})
  }

  getMatches(summoner: any) {
    var options = "beginIndex=0&endIndex=10&";
    this.summonerService.riotGetMatches(summoner.accountId, options).subscribe((data: any) => {
      var matches = data.matches
      matches.forEach(match => {
        this.summonerService.getMatchData(match.gameId).subscribe((data:object) => {
        this.matches.push(data)
        console.log("old")
        }, err => {
          this.summonerService.checkRate(1).subscribe(ok => {
            this.summonerService.riotGetMatchData(match.gameId).subscribe((data: object) => {
              this.summonerService.newMatch(data).subscribe(data=>{},err=>{console.error(err)});
              this.matches.push(data)
              console.log("new")
            })
          }, err => {
            console.log("riot api reached")
          }) 
        })
      })
    })
  }
  
  //algo
  sortLeagues(leagues: any[]) {
    leagues.forEach(league => {
      league.winRatio = Math.round(100*(league.wins/(league.wins+league.losses)))
      league.tier = league.tier.toLowerCase();
      if (league.queueType == "RANKED_SOLO_5x5") {
        this.solo = league
      } else if (league.queueType == "RANKED_FLEX_SR") {
        this.flex_5v5 = league
      } else if (league.queueType == "RANKED_FLEX_TT") {
        this.flex_3v3 = league
      }
    })
  }

}
