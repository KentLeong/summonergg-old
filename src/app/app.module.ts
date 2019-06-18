import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { SummonerComponent } from './summoner/summoner.component';
import { SummonerSearchComponent } from './summoner-search/summoner-search.component';
import { SummonerMatchHistoryComponent } from './summoner/summoner-match-history/summoner-match-history.component';
import { SummonerDetailComponent } from './summoner/summoner-detail/summoner-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    SummonerComponent,
    SummonerSearchComponent,
    SummonerMatchHistoryComponent,
    SummonerDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
