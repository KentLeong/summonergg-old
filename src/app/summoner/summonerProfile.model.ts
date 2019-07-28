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
  recent: {
    ranked: Object,
    players: Object,
    roles: role[],
    champions: champion[],
  }
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
class champion {
  assists: number;
  deaths: number;
  id: {
    id: string,
    name: string
  };
  kda: number;
  kills: number;
  losses: number;
  percent: number;
  total: number;
  wins: number;
  percentStyle: object;
  kdaStyle: object;
}

class role {
  percent: number;
  name: string;
  style: object;
}