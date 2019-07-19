var modes = {
  0: {
    English: {
      type: "Custom",
      description: "Custom Games",
      name: "Custom",
    },
    type: "custom"
  },
  2: {
    English: {
      type: "Summoner's Rift",
      description: "5v5 Blind Pick games",
      name: "Blind Pick",
    },
    type: "norm"
  },
  4: {
    English: {
      type: "Summoner's Rift",
      description: "5v5 Ranked Solo games",
      name: "Ranked Solo",
    },
    type: "solo"
  },
  6: {
    English: {
      type: "Summoner's Rift",
      description: "5v5 Ranked Premade games",
      name: "Ranked 5v5",
    },
    type: "flex5v5"
  },
  7: {
    English: {
      type: "Summoner's Rift",
      description: "Co-op vs AI games",
      name: "Co-op vs AI",
    },
    type: "bot"
  },
  8: {
    English: {
      type: "Twisted Treeline",
      description: "3v3 Normal games",
      name: "3v3 TT",
    },
    type: "norm"
  },
  9: {
    English: {
      type: "Twisted Treeline",
      description: "3v3 Ranked Flex games",
      name: "Flex 3v3",
    },
    type: "flex3v3"
  },
  14: {
    English: {
      type: "Summoner's Rift",
      description: "5v5 Draft Pick games",
      name: "Draft Pick",
    },
    type: "norm"
  },
  16: {
    English: {
      type: "Crystal Scar",
      description: "5v5 Dominion Blind Pick games",
      name: "Crystal Scar: BP",
    },
    type: "special"
  },
  17: {
    English: {
      type: "Crystal Scar",
      description: "5v5 Dominion Draft Pick games",
      name: "Crystal Scar: DP",
    },
    type: "special"
  },
  25: {
    English: {
      type: "Crystal Scar",
      description: "Dominion Co-op vs AI games",
      name: "Crystal Scar: Co-op",
    },
    type: "special"
  },
  31: {
    English: {
      type: "Summoner's Rift",
      description: "Co-op vs AI Intro Bot games",
      name: "Co-op vs AI Intro",
    },
    type: "bot"
  },
  32: {
    English: {
      type: "Summoner's Rift",
      description: "Co-op vs AI Beginner Bot games",
      name: "Co-op vs AI Beginner",
    },
    type: "bot"
  },
  33: {
    English: {
      type: "Summoner's Rift",
      description: "Co-op vs AI Intermediate Bot games",
      name: "Co-op vs AI Intermediate",
    },
    type: "bot"
  },
  41: {
    English: {
      type: "Twisted Treelin",
      description: "3v3 Ranked Team games",
      name: "Ranked Flex",
    },
    type: "flex3v3"
  },
  42: {
    English: {
      type: "Summoner's Rift",
      description: "5v5 Ranked Team games",
      name: "Ranked Flex",
    },
    type: "flex5v5"
  },
  52: {
    English: {
      type: "Twisted Treeline",
      description: "Co-op vs AI games",
      name: "Co-op vs AI",
    },
    type: "bot"
  },
  61: {
    English: {
      type: "Summoner's Rift",
      description: "5v5 Team Builder games",
      name: "Team Builder",
    },
    type: "special"
  },
  65: {
    English: {
      type: "Howling Abyss",
      description: "5v5 ARAM games",
      name: "ARAM",
    },
    type: "aram"
  },
  67: {
    English: {
      type: "Howling Abyss",
      description: "ARAM Co-op vs AI games",
      name: "ARAM Co-op",
    },
    type: "bot"
  },
  70: {
    English: {
      type: "Summoner's Rift",
      description: "One for All games",
      name: "One for All",
    },
    type: "special"
  },
  72: {
    English: {
      type: "Howling Abyss",
      description: "1v1 Snowdown Showdown games",
      name: "1v1 Snowdown",
    },
    type: "special"
  },
  73: {
    English: {
      type: "Howling Abyss",
      description: "2v2 Snowdown Showdown games",
      name: "2v2 Snowdown",
    },
    type: "aram"
  },
  75: {
    English: {
      type: "Summoner's Rift",
      description: "6v6 Hexakill games",
      name: "6v6 Hexakill",
    },
    type: "special"
  },
  76: {
    English: {
      type: "Summoner's Rift",
      description: "Ultra Rapid Fire games",
      name: "SR URF",
    },
    type: "special"
  },
  78: {
    English: {
      type: "Howling Abyss",
      description: "One For All: Mirror Mode games",
      name: "One for All",
    },
    type: "special"
  },
  83: {
    English: {
      type: "Summoner's Rift",
      description: "Co-op vs AI Ultra Rapid Fire games",
      name: "Co-op AI URF",
    },
    type: "special"
  },
  91: {
    English: {
      type: "Summoner's Rift",
      description: "Doom Bots Rank 1 games",
      name: "Doom Bots: R1",
    },
    type: "special"
  },
  92: {
    English: {
      type: "Summoner's Rift",
      description: "Doom Bots Rank 2 games",
      name: "Doom Bots: R2",
    },
    type: "special"
  },
  93: {
    English: {
      type: "Summoner's Rift",
      description: "Doom Bots Rank 3 games",
      name: "Doom Bots: R3",
    },
    type: "special"
  },
  96: {
    English: {
      type: "Crystal Scar",
      description: "Ascension games",
      name: "Ascension",
    },
    type: "special"
  },
  98: {
    English: {
      type: "Twisted Treeline",
      description: "6v6 Hexakill games",
      name: "TT URF",
    },
    type: "special"
  },
  100: {
    English: {
      type: "Butcher's Bridge",
      description: "5v5 ARAM games",
      name: "Butcher's Bridge",
    },
    type: "special"
  },
  300: {
    English: {
      type: "Howling Abyss",
      description: "Legend of the Poro King games",
      name: "Poro King",
    },
    type: "special"
  },
  310: {
    English: {
      type: "Summoner's Rift",
      description: "Nemesis games",
      name: "Nemesis",
    },
    type: "special"
  },
  313: {
    English: {
      type: "Summoner's Rift",
      description: "Black Market Brawlers games",
      name: "BMBG",
    },
    type: "special"
  },
  315: {
    English: {
      type: "Summoner's Rift",
      description: "Nexus Siege games",
      name: "Nexus Siege",
    },
    type: "special"
  },
  317: {
    English: {
      type: "Crystal Scar",
      description: "Definitely Not Dominion games",
      name: "DNDG",
    },
    type: "special"
  },
  318: {
    English: {
      type: "Summoner's Rift",
      description: "ARURF games",
      name: "ARURF",
    },
    type: "special"
  },
  325: {
    English: {
      type: "Summoner's Rift",
      description: "All Random games",
      name: "SRAR",
    },
    type: "special"
  },
  400: {
    English: {
      type: "Summoner's Rift",
      description: "5v5 Draft Pick games",
      name: "Draft Pick",
    },
    type: "norm"
  },
  410: {
    English: {
      type: "Summoner's Rift",
      description: "5v5 Ranked Dynamic games",
      name: "Ranked Dynamic",
    },
    type: "flex5v5"
  },
  420: {
    English: {
      type: "Summoner's Rift",
      description: "5v5 Ranked Solo games",
      name: "Ranked Solo",
    },
    type: "solo"
  },
  430: {
    English: {
      type: "Summoner's Rift",
      description: "5v5 Blind Pick games",
      name: "Blind Pick",
    },
    type: "norm"
  },
  440: {
    English: {
      type: "Summoner's Rift",
      description: "5v5 Ranked Flex games",
      name: "Ranked Flex",
    },
    type: "flex5v5"
  },
  450: {
    English: {
      type: "Howling Abyss",
      description: "5v5 ARAM games",
      name: "ARAM",
    },
    type: "aram"
  },
  460: {
    English: {
      type: "Twisted Treeline",
      description: "3v3 Blind Pick games",
      name: "Blind Pick",
    },
    type: "norm"
  },
  470: {
    English: {
      type: "Twisted Treeline",
      description: "3v3 Ranked Flex games",
      name: "Ranked Flex",
    },
    type: "flex3v3"
  },
  600: {
    English: {
      type: "Summoner's Rift",
      description: "Blood Hunt Assassin games",
      name: "Blood Hunt Assassin",
    },
    type: "special"
  },
  610: {
    English: {
      type: "Cosmic Ruins",
      description: "Dark Star: Singularity games",
      name: "Dark Star",
    },
    type: "special"
  },
  700: {
    English: {
      type: "Summoner's Rift",
      description: "Clash games",
      name: "Clash",
    },
    type: "special"
  },
  800: {
    English: {
      type: "Twisted Treeline",
      description: "Co-op vs. AI Intermediate Bot games",
      name: "Co-op Intermediate",
    },
    type: "bot"
  },
  810: {
    English: {
      type: "Twisted Treeline",
      description: "Co-op vs. AI Intro Bot games",
      name: "Co-op Intro",
    },
    type: "bot"
  },
  820: {
    English: {
      type: "Twisted Treeline",
      description: "Co-op vs. AI Beginner Bot games",
      name: "Co-op Beginner",
    },
    type: "bot"
  },
  830: {
    English: {
      type: "Summoner's Rift",
      description: "Co-op vs. AI Intro Bot games",
      name: "Co-op Intro",
    },
    type: "bot"
  },
  840: {
    English: {
      type: "Summoner's Rift",
      description: "Co-op vs. AI Beginner Bot games",
      name: "Co-op Beginner",
    },
    type: "bot"
  },
  850: {
    English: {
      type: "Summoner's Rift",
      description: "Co-op vs. AI Intermediate Bot games",
      name: "Co-op Intermediate",
    },
    type: "bot"
  },
  900: {
    English: {
      type: "Summoner's Rift",
      description: "ARURF games",
      name: "ARURF",
    },
    type: "special"
  },
  910: {
    English: {
      type: "Crystal Scar",
      description: "Ascension games",
      name: "Ascension",
    },
    type: "special"
  },
  920: {
    English: {
      type: "Howling Abyss",
      description: "Legend of the Poro King games",
      name: "Poro King",
    },
    type: "special"
  },
  940: {
    English: {
      type: "Summoner's Rift",
      description: "Nexus Siege games",
      name: "Nexus Siege",
    },
    type: "special"
  },
  950: {
    English: {
      type: "Summoner's Rift",
      description: "Doom Bots Voting games",
      name: "Doom Bot",
    },
    type: "special"
  },
  960: {
    English: {
      type: "Summoner's Rift",
      description: "Doom Bots Standard games",
      name: "Doom Bot",
    },
    type: "special"
  },
  980: {
    English: {
      type: "Valoran City Park",
      description: "Star Guardian Invasion: Normal games",
      name: "Star Guardian Invasion: Normal",
    },
    type: "special"
  },
  990: {
    English: {
      type: "Valoran City Park",
      description: "Star Guardian Invasion: Onslaught games",
      name: "Star Guardian Invasion: Onslaught",
    },
    type: "special"
  },
  1000: {
    English: {
      type: "Overcharge",
      description: "PROJECT: Hunters games",
      name: "PROJECT: Hunters",
    },
    type: "special"
  },
  1010: {
    English: {
      type: "Summoner's Rift",
      description: "Snow ARURF games",
      name: "Snow ARURF",
    },
    type: "special"
  },
  1020: {
    English: {
      type: "Summoner's Rift",
      description: "One for All games",
      name: "One for All",
    },
    type: "special"
  },
  1030: {
    English: {
      type: "Crash Site",
      description: "Odyssey Extraction: Intro games",
      name: "Odyssey Extraction: Intro",
    },
    type: "special"
  },
  1040: {
    English: {
      type: "Crash Site",
      description: "Odyssey Extraction: Cadet games",
      name: "Odyssey Extraction: Cadet",
    },
    type: "special"
  },
  1050: {
    English: {
      type: "Crash Site",
      description: "Odyssey Extraction: Crewmember games",
      name: "Odyssey Extraction: Crewmember",
    },
    type: "special"
  },
  1060: {
    English: {
      type: "Crash Site",
      description: "Odyssey Extraction: Captain games",
      name: "Odyssey Extraction: Captain",
    },
    type: "special"
  },
  1070: {
    English: {
      type: "Crash Site",
      description: "Odyssey Extraction: Onslaught games",
      name: "Odyssey Extraction: Onslaught",
    },
    type: "special"
  },
  1090: {
    English: {
      type: "Convergence",
      description: "Teamfight Tactics games",
      name: "TFT",
    },
    type: "norm"
  },
  1100: {
    English: {
      type: "Convergence",
      description: "Teamfight Tactics games",
      name: "Ranked TFT",
    },
    type: "tft"
  },
  1200: {
    English: {
      type: "Nexus Blitz",
      description: "Nexus Blitz games",
      name: "Nexus Blitz",
    },
    type: "special"
  }
}

module.exports = modes