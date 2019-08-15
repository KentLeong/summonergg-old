import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { SummonerComponent } from './summoner/summoner.component';
import { InhouseComponent } from './inhouse/inhouse.component';
import { TftComponent } from './tft/tft.component';
import { ChampionComponent } from './champion/champion.component';
import { TournamentComponent } from './tournament/tournament.component';

const routes: Routes = [
  { path: "", component: LandingComponent, pathMatch: "full"},
  { path: "summoner/:name", component: SummonerComponent, 
                            runGuardsAndResolvers: 'paramsChange'},
  { path: "inhouses", component: InhouseComponent},
  { path: "tft", component: TftComponent},
  { path: "champions", component: ChampionComponent},
  { path: "tournaments", component: TournamentComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }