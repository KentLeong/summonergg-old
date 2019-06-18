export class Match {
  gameId: string;
  platformId: string;
  gameCreation: any;
  gameDuration: number;
  queueId: string;
  mapId: string;
  seasonId: string;
  gameVersion: string;
  gameMode: string;
  gameType: string;
  teams: team[];
  participants: participant[];
  championId: string;
  championName: string;
}

class team {
  teamId: string;
  win: string;
  firstBlood: boolean;
  firstTower: boolean;
  firstInhibitor: boolean;
  firstBaron: boolean;
  firstDragon: boolean;
  firstRiftHerald: boolean;
  towerKills: number;
  inhibitorKills: number;
  baronKills: number;
  dragonKills: number;
  vilemawKills: number;
  riftHeraldKills: number;
  dominionVictoryScore: number;
  bans: ban;
}

class ban {
  championId: string;
  pickTurn: number;
}

class participant {
  platformId: string;
  accountId: string;
  summonerName: string;
  summonerId: string;
  currentPlatformId: string;
  currentAccountId: string;
  matchHistoryUri: string;
  profileIcon: string;
  participantId: number;
  teamId: string;
  championId: string;
  spell1Id: string;
  spell2Id: string;
  highestAchievedSeasonTier: string;
  stats: object;
  timeline: timeline;
  championName: string;
}

class timeline {
  participantId: string;
  creepsPerMinDelas: object;
  xpPerMinDeltas: object;
  goldPerMinDeltas: object;
  csDiffPerMinDeltas: object;
  xpDiffPerMinDeltas: object;
  damageTakenPerMinDeltas: object;
  damageTakenDiffPerMinDeltas: object;
  role: string;
  lane: string;
}