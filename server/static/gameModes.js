var modes = {
  0: {
    type: "Custom",
    description: "Custom Games",
    name: "Custom",
    cat: "custom"
  },
  2: {
    type: "Summoner's Rift",
    description: "5v5 Blind Pick games",
    name: "Blind Pick",
    cat: "norm"
  },
  4: {
    type: "Summoner's Rift",
    description: "",
    name: "",
    cat: ""
  },
  6: {
    type: "Summoner's Rift",
    description: "",
    name: "",
    cat: ""
  },
  7: {
    type: "Summoner's Rift",
    description: "",
    name: "",
    cat: ""
  },
  8: {
    type: "",
    description: "",
    name: "",
    cat: ""
  },
  9: {
    type: "",
    description: "",
    name: "",
    cat: ""
  },
  14: {
    type: "Summoner's Rift",
    description: "",
    name: "",
    cat: ""
  },
  16: {
    type: "",
    description: "",
    name: "",
    cat: ""
  },
  17: {
    type: "",
    description: "",
    name: "",
    cat: ""
  },
  25: {
    type: "",
    description: "",
    name: "",
    cat: ""
  },
  31: {
    type: "Summoner's Rift",
    description: "",
    name: "",
    cat: ""
  },
  32: {
    type: "Summoner's Rift",
    description: "",
    name: "",
    cat: ""
  },
  33: {
    type: "Summoner's Rift",
    description: "",
    name: "",
    cat: ""
  },
  41: {
    type: "",
    description: "",
    name: "",
    cat: ""
  },
  42: {
    type: "Summoner's Rift",
    description: "",
    name: "",
    cat: ""
  },
  52: {
    type: "",
    description: "",
    name: "",
    cat: ""
  },
  61: {
    type: "Summoner's Rift",
    description: "",
    name: "",
    cat: ""
  },
  65: {
    type: "",
    description: "",
    name: "",
    cat: ""
  },
  67: {
    type: "",
    description: "",
    name: "",
    cat: ""
  },
  70: {
    type: "Summoner's Rift",
    description: "",
    name: "",
    cat: ""
  },
  72: {
    type: "Howling Abyss",
    description: "1v1 Snowdown Showdown games",
    name: "1v1 Snowdown",
    cat: "special"
  },
  73: {
    type: "Howling Abyss",
    description: "2v2 Snowdown Showdown games",
    name: "2v2 Snowdown",
    cat: "aram"
  },
  75: {
    type: "Summoner's Rift",
    description: "6v6 Hexakill games",
    name: "6v6 Hexakill",
    cat: "special"
  },
  76: {
    type: "Summoner's Rift",
    description: "Ultra Rapid Fire games",
    name: "SR URF",
    cat: "special"
  },
  78: {
    type: "Howling Abyss",
    description: "One For All: Mirror Mode games",
    name: "One for All",
    cat: "special"
  },
  83: {
    type: "Summoner's Rift",
    description: "Co-op vs AI Ultra Rapid Fire games",
    name: "Co-op AI URF",
    cat: "special"
  },
  91: {
    type: "Summoner's Rift",

  },
  92: {
    type: "Summoner's Rift",

  },
  93: {
    type: "Summoner's Rift",

  },
  96: {
    type: "Crystal Scar",

  },
  98: {
    type: "Twisted Treeline",
    description: "6v6 Hexakill games",
    name: "TT URF",
    cat: "special"
  },
  100: {
    type: "Butcher's Bridge",
    description: "5v5 ARAM games",
    name: "Butcher's Bridge",
    cat: "special"
  },
  300: {

  },
  310: {
    type: "Summoner's Rift",
    description: "Nemesis games",
    name: "Nemesis",
    cat: "special"
  },
  313: {
    type: "Summoner's Rift",
    description: "Black Market Brawlers games",
    name: "BMBG",
    cat: "special"
  },
  315: {
    type: "Summoner's Rift",
    description: "",
    name: "",
    cat: ""
  },
  317: {
    type: "Crystal Scar",
    description: "Definitely Not Dominion games",
    name: "DNDG",
    cat: "special"
  },
  318: {
    type: "Summoner's Rift"
  },
  325: {
    type: "Summoner's Rift",
    description: "All Random games",
    name: "SRAR",
    cat: "special"
  },
  400: {
    type: "Summoner's Rift",
    description: "5v5 Draft Pick games",
    name: "Draft Pick",
    cat: "norm"
  },
  410: {
    type: "Summoner's Rift"
  },
  420: {
    type: "Summoner's Rift",
    description: "5v5 Ranked Solo games",
    name: "Ranked Solo",
    cat: "solo"
  },
  430: {
    type: "Summoner's Rift",
    description: "5v5 Blind Pick games",
    name: "Blind Pick",
    cat: "norm"
  },
  440: {
    type: "Summoner's Rift",
    description: "5v5 Ranked Flex games",
    name: "Ranked Flex",
    cat: "flex5v5"
  },
  450: {
    type: "Howling Abyss",
    description: "5v5 ARAM games",
    name: "ARAM",
    cat: "aram"
  },
  460: {
    type: "Twisted Treeline",
    description: "3v3 Blind Pick games",
    name: "Blind Pick",
    cat: "norm"
  },
  470: {
    type: "Twisted Treeline",
    description: "3v3 Ranked Flex games",
    name: "Ranked Flex",
    cat: "flex3v3"
  },
  600: {
    type: "Summoner's Rift",
    description: "Blood Hunt Assassin games",
    name: "Blood Hunt Assassin",
    cat: "special"
  },
  610: {
    type: "Cosmic Ruins",
    description: "Dark Star: Singularity games",
    name: "Dark Star",
    cat: "special"
  },
  700: {
    type: "Summoner's Rift",
    description: "Clash games",
    name: "Clash",
    cat: "special"
  },
  800: {
    type: "Twisted Treeline",
    description: "Co-op vs. AI Intermediate Bot games",
    name: "Co-op Intermediate",
    cat: "bot"
  },
  810: {
    type: "Twisted Treeline",
    description: "Co-op vs. AI Intro Bot games",
    name: "Co-op Intro",
    cat: "bot"
  },
  820: {
    type: "Twisted Treeline",
    description: "Co-op vs. AI Beginner Bot games",
    name: "Co-op Beginner",
    cat: "bot"
  },
  830: {
    type: "Summoner's Rift",
    description: "Co-op vs. AI Intro Bot games",
    name: "Co-op Intro",
    cat: "bot"
  },
  840: {
    type: "Summoner's Rift",
    description: "Co-op vs. AI Beginner Bot games",
    name: "Co-op Beginner",
    cat: "bot"
  },
  850: {
    type: "Summoner's Rift",
    description: "Co-op vs. AI Intermediate Bot games",
    name: "Co-op Intermediate",
    cat: "bot"
  },
  900: {
    type: "Summoner's Rift",
    description: "ARURF games",
    name: "ARURF",
    cat: "special"
  },
  910: {
    type: "Crystal Scar",
    description: "Ascension games",
    name: "Ascension",
    cat: "special"
  },
  920: {
    type: "Howling Abyss",
    description: "Legend of the Poro King games",
    name: "Poro King",
    cat: "special"
  },
  940: {
    type: "Summoner's Rift",
    description: "Nexus Siege games",
    name: "Nexus Siege",
    cat: "special"
  },
  950: {
    type: "Summoner's Rift",
    description: "Doom Bots Voting games",
    name: "Doom Bot",
    cat: "special"
  },
  960: {
    type: "Summoner's Rift",
    description: "Doom Bots Standard games",
    name: "Doom Bot",
    cat: "special"
  },
  980: {
    type: "Valoran City Park",
    description: "Star Guardian Invasion: Normal games",
    name: "Star Guardian Invasion: Normal",
    cat: "special"
  },
  990: {
    type: "Valoran City Park",
    description: "Star Guardian Invasion: Onslaught games",
    name: "Star Guardian Invasion: Onslaught",
    cat: "special"
  },
  1000: {
    type: "Overcharge",
    description: "PROJECT: Hunters games",
    name: "PROJECT: Hunters",
    cat: "special"
  },
  1010: {
    type: "Summoner's Rift",
    description: "Snow ARURF games",
    name: "Snow ARURF",
    cat: "special"
  },
  1020: {
    type: "Summoner's Rift",
    description: "One for All games",
    name: "One for All",
    cat: "special"
  },
  1030: {
    type: "Crash Site",
    description: "Odyssey Extraction: Intro games",
    name: "Odyssey Extraction: Intro",
    cat: "special"
  },
  1040: {
    type: "Crash Site",
    description: "Odyssey Extraction: Cadet games",
    name: "Odyssey Extraction: Cadet",
    cat: "special"
  },
  1050: {
    type: "Crash Site",
    description: "Odyssey Extraction: Crewmember games",
    name: "Odyssey Extraction: Crewmember",
    cat: "special"
  },
  1060: {
    type: "Crash Site",
    description: "Odyssey Extraction: Captain games",
    name: "Odyssey Extraction: Captain",
    cat: "special"
  },
  1070: {
    type: "Crash Site",
    description: "Odyssey Extraction: Onslaught games",
    name: "Odyssey Extraction: Onslaught",
    cat: "special"
  },
  1090: {
    type: "Convergence",
    description: "Teamfight Tactics games",
    name: "TFT",
    cat: "norm"
  },
  1100: {
    type: "Convergence",
    description: "Teamfight Tactics games",
    name: "Ranked TFT",
    cat: "tft"
  },
  1200: {
    type: "Nexus Blitz",
    description: "Nexus Blitz games",
    name: "Nexus Blitz",
    cat: "special"
  }
}

module.exports = modes