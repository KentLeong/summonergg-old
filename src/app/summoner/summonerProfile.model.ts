import { Summoner } from './summoner.model';
import { League } from './summoner-detail/league.model';
import { Match } from './summoner-match-history/match.model';

export class SummonerProfile {
  summoner: Summoner;
  leagues: Object;
  matches: [Match];
  lastUpdated: Date;
  stats: any;

  constructor(profile) {
    this.summoner = profile.summoner;
    this.leagues = profile.leagues;
    this.matches = profile.matches;
    this.stats = profile.stats;
  }
}