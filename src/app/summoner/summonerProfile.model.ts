import { Summoner } from './summoner.model';
import { League } from './summoner-detail/league.model';
import { Match } from './summoner-match-history/match.model';

export class SummonerProfile {
  summoner: Summoner;
  leagues: [League];
  matches: [Match];

  constructor(summoner: Summoner, leagues: [League], matches: [Match]) {
    this.summoner = summoner;
    this.leagues = leagues;
    this.matches = matches;
  }
}