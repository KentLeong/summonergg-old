export class Match {
  _id: string;
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
  // indiv
  outcome: string;
  bg: object;
  championId: {
    id: string,
    name: string
  };
  championName: string;
  role: string;
  spell1: string;
  spell2: string;
  perk1: string;
  perk2: string;
  blueTeam: object[];
  redTeam: object[];
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