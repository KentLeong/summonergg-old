import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { SummonerComponent } from './summoner/summoner.component';

const routes: Routes = [
  { path: "", component: LandingComponent, pathMatch: "full"},
  { path: "summoner/:name", component: SummonerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }