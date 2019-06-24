import { Summoner } from './summoner.model';
import { League } from './summoner-detail/league.model';
import { Match } from './summoner-match-history/match.model';

export class SummonerProfile {
  summoner: Summoner;
  leagues: [League];
  matches: [Match];
  lastUpdated: Date;
  lastPlayed: String;

  constructor(profile) {
    this.summoner = profile.summoner;
    this.leagues = profile.leagues;
    this.matches = profile.matches;
  }
}