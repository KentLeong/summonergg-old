var modes = {
  0: {
    English: {
      type: "Custom",
      description: "Custom Games",
      name: "Custom",
    },
    queue: "custom",
    id: 0
  },
  2: {
    English: {
      type: "Summoner's Rift",
      description: "5v5 Blind Pick games",
      name: "Blind Pick",
    },
    queue: "norm",
    id: 2
  },
  4: {
    English: {
      type: "Summoner's Rift",
      description: "5v5 Ranked Solo games",
      name: "Ranked Solo",
    },
    queue: "solo",
    id: 4
  },
  6: {
    English: {
      type: "Summoner's Rift",
      description: "5v5 Ranked Premade games",
      name: "Ranked 5v5",
    },
    queue: "flex5v5",
    id: 6
  },
  7: {
    English: {
      type: "Summoner's Rift",
      description: "Co-op vs AI games",
      name: "Co-op vs AI",
    },
    queue: "bot",
    id: 7
  },
  8: {
    English: {
      type: "Twisted Treeline",
      description: "3v3 Normal games",
      name: "3v3 TT",
    },
    queue: "norm",
    id: 8
  },
  9: {
    English: {
      type: "Twisted Treeline",
      description: "3v3 Ranked Flex games",
      name: "Flex 3v3",
    },
    queue: "flex3v3",
    id: 9
  },
  14: {
    English: {
      type: "Summoner's Rift",
      description: "5v5 Draft Pick games",
      name: "Draft Pick",
    },
    queue: "norm",
    id: 14
  },
  16: {
    English: {
      type: "Crystal Scar",
      description: "5v5 Dominion Blind Pick games",
      name: "Crystal Scar: BP",
    },
    queue: "special",
    id: 16
  },
  17: {
    English: {
      type: "Crystal Scar",
      description: "5v5 Dominion Draft Pick games",
      name: "Crystal Scar: DP",
    },
    queue: "special",
    id: 17
  },
  25: {
    English: {
      type: "Crystal Scar",
      description: "Dominion Co-op vs AI games",
      name: "Crystal Scar: Co-op",
    },
    queue: "special",
    id: 25
  },
  31: {
    English: {
      type: "Summoner's Rift",
      description: "Co-op vs AI Intro Bot games",
      name: "Co-op vs AI Intro",
    },
    queue: "bot",
    id: 31
  },
  32: {
    English: {
      type: "Summoner's Rift",
      description: "Co-op vs AI Beginner Bot games",
      name: "Co-op vs AI Beginner",
    },
    queue: "bot",
    id: 32
  },
  33: {
    English: {
      type: "Summoner's Rift",
      description: "Co-op vs AI Intermediate Bot games",
      name: "Co-op vs AI Intermediate",
    },
    queue: "bot",
    id: 33
  },
  41: {
    English: {
      type: "Twisted Treelin",
      description: "3v3 Ranked Team games",
      name: "Ranked Flex",
    },
    queue: "flex3v3",
    id: 41
  },
  42: {
    English: {
      type: "Summoner's Rift",
      description: "5v5 Ranked Team games",
      name: "Ranked Flex",
    },
    queue: "flex5v5",
    id: 42
  },
  52: {
    English: {
      type: "Twisted Treeline",
      description: "Co-op vs AI games",
      name: "Co-op vs AI",
    },
    queue: "bot",
    id: 52
  },
  61: {
    English: {
      type: "Summoner's Rift",
      description: "5v5 Team Builder games",
      name: "Team Builder",
    },
    queue: "special",
    id: 61
  },
  65: {
    English: {
      type: "Howling Abyss",
      description: "5v5 ARAM games",
      name: "ARAM",
    },
    type: "aram",
    id: 65
  },
  67: {
    English: {
      type: "Howling Abyss",
      description: "ARAM Co-op vs AI games",
      name: "ARAM Co-op",
    },
    queue: "bot",
    id: 67
  },
  70: {
    English: {
      type: "Summoner's Rift",
      description: "One for All games",
      name: "One for All",
    },
    queue: "special",
    id: 70
  },
  72: {
    English: {
      type: "Howling Abyss",
      description: "1v1 Snowdown Showdown games",
      name: "1v1 Snowdown",
    },
    queue: "special",
    id: 72
  },
  73: {
    English: {
      type: "Howling Abyss",
      description: "2v2 Snowdown Showdown games",
      name: "2v2 Snowdown",
    },
    type: "aram",
    id: 73
  },
  75: {
    English: {
      type: "Summoner's Rift",
      description: "6v6 Hexakill games",
      name: "6v6 Hexakill",
    },
    queue: "special",
    id: 75
  },
  76: {
    English: {
      type: "Summoner's Rift",
      description: "Ultra Rapid Fire games",
      name: "SR URF",
    },
    queue: "special",
    id: 76
  },
  78: {
    English: {
      type: "Howling Abyss",
      description: "One For All: Mirror Mode games",
      name: "One for All",
    },
    queue: "special",
    id: 78
  },
  83: {
    English: {
      type: "Summoner's Rift",
      description: "Co-op vs AI Ultra Rapid Fire games",
      name: "Co-op AI URF",
    },
    queue: "special",
    id: 83
  },
  91: {
    English: {
      type: "Summoner's Rift",
      description: "Doom Bots Rank 1 games",
      name: "Doom Bots: R1",
    },
    queue: "special",
    id: 91
  },
  92: {
    English: {
      type: "Summoner's Rift",
      description: "Doom Bots Rank 2 games",
      name: "Doom Bots: R2",
    },
    queue: "special",
    id: 92
  },
  93: {
    English: {
      type: "Summoner's Rift",
      description: "Doom Bots Rank 3 games",
      name: "Doom Bots: R3",
    },
    queue: "special",
    id: 93
  },
  96: {
    English: {
      type: "Crystal Scar",
      description: "Ascension games",
      name: "Ascension",
    },
    queue: "special",
    id: 96
  },
  98: {
    English: {
      type: "Twisted Treeline",
      description: "6v6 Hexakill games",
      name: "TT URF",
    },
    queue: "special",
    id: 98
  },
  100: {
    English: {
      type: "Butcher's Bridge",
      description: "5v5 ARAM games",
      name: "Butcher's Bridge",
    },
    queue: "special",
    id: 100
  },
  300: {
    English: {
      type: "Howling Abyss",
      description: "Legend of the Poro King games",
      name: "Poro King",
    },
    queue: "special",
    id: 300
  },
  310: {
    English: {
      type: "Summoner's Rift",
      description: "Nemesis games",
      name: "Nemesis",
    },
    queue: "special",
    id: 310
  },
  313: {
    English: {
      type: "Summoner's Rift",
      description: "Black Market Brawlers games",
      name: "BMBG",
    },
    queue: "special",
    id: 313
  },
  315: {
    English: {
      type: "Summoner's Rift",
      description: "Nexus Siege games",
      name: "Nexus Siege",
    },
    queue: "special",
    id: 315
  },
  317: {
    English: {
      type: "Crystal Scar",
      description: "Definitely Not Dominion games",
      name: "DNDG",
    },
    queue: "special",
    id: 317
  },
  318: {
    English: {
      type: "Summoner's Rift",
      description: "ARURF games",
      name: "ARURF",
    },
    queue: "special",
    id: 318
  },
  325: {
    English: {
      type: "Summoner's Rift",
      description: "All Random games",
      name: "SRAR",
    },
    queue: "special",
    id: 325
  },
  400: {
    English: {
      type: "Summoner's Rift",
      description: "5v5 Draft Pick games",
      name: "Draft Pick",
    },
    queue: "norm",
    id: 400
  },
  410: {
    English: {
      type: "Summoner's Rift",
      description: "5v5 Ranked Dynamic games",
      name: "Ranked Dynamic",
    },
    queue: "flex5v5",
    id: 410
  },
  420: {
    English: {
      type: "Summoner's Rift",
      description: "5v5 Ranked Solo games",
      name: "Ranked Solo",
    },
    queue: "solo",
    id: 420
  },
  430: {
    English: {
      type: "Summoner's Rift",
      description: "5v5 Blind Pick games",
      name: "Blind Pick",
    },
    queue: "norm",
    id: 430
  },
  440: {
    English: {
      type: "Summoner's Rift",
      description: "5v5 Ranked Flex games",
      name: "Ranked Flex",
    },
    queue: "flex5v5",
    id: 440
  },
  450: {
    English: {
      type: "Howling Abyss",
      description: "5v5 ARAM games",
      name: "ARAM",
    },
    type: "aram",
    id: 450
  },
  460: {
    English: {
      type: "Twisted Treeline",
      description: "3v3 Blind Pick games",
      name: "Blind Pick",
    },
    queue: "norm",
    id: 460
  },
  470: {
    English: {
      type: "Twisted Treeline",
      description: "3v3 Ranked Flex games",
      name: "Ranked Flex",
    },
    queue: "flex3v3",
    id: 470
  },
  600: {
    English: {
      type: "Summoner's Rift",
      description: "Blood Hunt Assassin games",
      name: "Blood Hunt Assassin",
    },
    queue: "special",
    id: 600
  },
  610: {
    English: {
      type: "Cosmic Ruins",
      description: "Dark Star: Singularity games",
      name: "Dark Star",
    },
    queue: "special",
    id: 610
  },
  700: {
    English: {
      type: "Summoner's Rift",
      description: "Clash games",
      name: "Clash",
    },
    queue: "special",
    id: 700
  },
  800: {
    English: {
      type: "Twisted Treeline",
      description: "Co-op vs. AI Intermediate Bot games",
      name: "Co-op Intermediate",
    },
    queue: "bot",
    id: 800
  },
  810: {
    English: {
      type: "Twisted Treeline",
      description: "Co-op vs. AI Intro Bot games",
      name: "Co-op Intro",
    },
    queue: "bot",
    id: 810
  },
  820: {
    English: {
      type: "Twisted Treeline",
      description: "Co-op vs. AI Beginner Bot games",
      name: "Co-op Beginner",
    },
    queue: "bot",
    id: 820
  },
  830: {
    English: {
      type: "Summoner's Rift",
      description: "Co-op vs. AI Intro Bot games",
      name: "Co-op Intro",
    },
    queue: "bot",
    id: 830
  },
  840: {
    English: {
      type: "Summoner's Rift",
      description: "Co-op vs. AI Beginner Bot games",
      name: "Co-op Beginner",
    },
    queue: "bot",
    id: 840
  },
  850: {
    English: {
      type: "Summoner's Rift",
      description: "Co-op vs. AI Intermediate Bot games",
      name: "Co-op Intermediate",
    },
    queue: "bot",
    id: 850
  },
  900: {
    English: {
      type: "Summoner's Rift",
      description: "ARURF games",
      name: "ARURF",
    },
    queue: "special",
    id: 900
  },
  910: {
    English: {
      type: "Crystal Scar",
      description: "Ascension games",
      name: "Ascension",
    },
    queue: "special",
    id: 910
  },
  920: {
    English: {
      type: "Howling Abyss",
      description: "Legend of the Poro King games",
      name: "Poro King",
    },
    queue: "special",
    id: 920
  },
  940: {
    English: {
      type: "Summoner's Rift",
      description: "Nexus Siege games",
      name: "Nexus Siege",
    },
    queue: "special",
    id: 940
  },
  950: {
    English: {
      type: "Summoner's Rift",
      description: "Doom Bots Voting games",
      name: "Doom Bot",
    },
    queue: "special",
    id: 950
  },
  960: {
    English: {
      type: "Summoner's Rift",
      description: "Doom Bots Standard games",
      name: "Doom Bot",
    },
    queue: "special",
    id: 960
  },
  980: {
    English: {
      type: "Valoran City Park",
      description: "Star Guardian Invasion: Normal games",
      name: "Star Guardian Invasion: Normal",
    },
    queue: "special",
    id: 980
  },
  990: {
    English: {
      type: "Valoran City Park",
      description: "Star Guardian Invasion: Onslaught games",
      name: "Star Guardian Invasion: Onslaught",
    },
    queue: "special",
    id: 990
  },
  1000: {
    English: {
      type: "Overcharge",
      description: "PROJECT: Hunters games",
      name: "PROJECT: Hunters",
    },
    queue: "special",
    id: 1000
  },
  1010: {
    English: {
      type: "Summoner's Rift",
      description: "Snow ARURF games",
      name: "Snow ARURF",
    },
    queue: "special",
    id: 1010
  },
  1020: {
    English: {
      type: "Summoner's Rift",
      description: "One for All games",
      name: "One for All",
    },
    queue: "special",
    id: 1020
  },
  1030: {
    English: {
      type: "Crash Site",
      description: "Odyssey Extraction: Intro games",
      name: "Odyssey Extraction: Intro",
    },
    queue: "special",
    id: 1030
  },
  1040: {
    English: {
      type: "Crash Site",
      description: "Odyssey Extraction: Cadet games",
      name: "Odyssey Extraction: Cadet",
    },
    queue: "special",
    id: 1040
  },
  1050: {
    English: {
      type: "Crash Site",
      description: "Odyssey Extraction: Crewmember games",
      name: "Odyssey Extraction: Crewmember",
    },
    queue: "special",
    id: 1050
  },
  1060: {
    English: {
      type: "Crash Site",
      description: "Odyssey Extraction: Captain games",
      name: "Odyssey Extraction: Captain",
    },
    queue: "special",
    id: 1060
  },
  1070: {
    English: {
      type: "Crash Site",
      description: "Odyssey Extraction: Onslaught games",
      name: "Odyssey Extraction: Onslaught",
    },
    queue: "special",
    id: 1070
  },
  1090: {
    English: {
      type: "Convergence",
      description: "Teamfight Tactics games",
      name: "TFT",
    },
    queue: "norm",
    id: 1090
  },
  1100: {
    English: {
      type: "Convergence",
      description: "Teamfight Tactics games",
      name: "Ranked TFT",
    },
    queue: "tft",
    id: 1100
  },
  1200: {
    English: {
      type: "Nexus Blitz",
      description: "Nexus Blitz games",
      name: "Nexus Blitz",
    },
    queue: "special",
    id: 1200
  }
}

module.exports = modes
