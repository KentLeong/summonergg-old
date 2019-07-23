import { Summoner } from './summoner.model';
import { League } from './summoner-detail/league.model';
import { Match } from './summoner-match-history/match.model';

export class SummonerProfile {
  summoner: Summoner;
  leagues: {
    solo: Object,
    flexSR: Object,
    flexTT: Object
  };
  matches: [Match];
  lastUpdated: Date;
  stats: any;
  champions: {
    total: Object,
    solo: Object,
    flexSR
  };

  constructor(profile) {
    this.summoner = profile.summoner;
    this.leagues = profile.leagues;
    this.matches = profile.matches;
    this.stats = profile.stats;
    this.champions = profile.champions;
    this.lastUpdated = profile.lastUpdated;
  }
}