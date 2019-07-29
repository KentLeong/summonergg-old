var login = "leong:E93c841k675";
var main = "68.5.243.142"
var Bottleneck = require("bottleneck/es5")
const limiter = new Bottleneck({
  minTime: 41
})
module.exports = {
  limiter: limiter,
  endpoints: {
    // "br": {
    //   name: "Brazil",
    //   riot: "br1",
    //   db: "mongodb://localhost:27017"
    // },
    // "eune": {
    //   name: "Europe East",
    //   riot: "eun1",
    //   db: "mongodb://localhost:27017"
    // },
    // "euw": {
    //   name: "Europe West",
    //   riot: "euw1",
    //   db: "mongodb://localhost:27017"
    // },
    // "jp": {
    //   name: "Japan",
    //   riot: "jp1",
    //   db: "mongodb://localhost:27017"
    // },
    // "kr": {
    //   name: "Korea",
    //   riot: "kr",
    //   db: "mongodb://localhost:27017"
    // },
    // "lan": {
    //   name: "Latin North America",
    //   riot: "la1",
    //   db: "mongodb://localhost:27017"
    // },
    // "las": {
    //   name: "Latin South America",
    //   riot: "la2",
    //   db: "mongodb://localhost:27017"
    // },
    "na": {
      name: "North America",
      riot: "na1",
      main: "mongodb://"+login+"@"+main+":27017",
      match: "mongodb://"+login+"@"+main+":27018"
    },
    // "oce": {
    //   name: "Oceanic",
    //   riot: "oc1",
    //   db: "mongodb://localhost:27017"
    // },
    // "tr": {
    //   name: "Turkey",
    //   riot: "tr1",
    //   db: "mongodb://localhost:27017"
    // },
    // "ru": {
    //   name: "Russia",
    //   riot: "ru",
    //   db: "mongodb://localhost:27017"
    // },
    // "pbe": {
    //   name: "Public Beta",
    //   riot: "pbe1",
    //   db: "mongodb://localhost:27017"
    // }
  },
  languages: {
    "English": "en_US",
    "Chinese": "zh_CN",
    "Korean": "ko_KR",
    "Japanese": "ja_JP",
    "Spanish": "es_ES",
    "Vietnamese": "vn_VN",
    "Thailand": "th_TH",
    "Turkish": "tr_TR",
    "Russian": "ru_RU",
    "Portuguese": "pt_BR",
    "French": "fr_FR",
    "Italian": "it_IT",
    "German": "de_DE",
    "Hungary": "hu_HU",
    "Romanian": "ro_RO",
    "Polish": "pl_PL",
    "Greek": "el_GR",
    "Czech": "cs_CZ"
  },
  season: 13,
  key: "RGAPI-f56e42ef-0c34-4b99-97c9-b0d2fe42f4e6",
  ver: "9.14.1",
  secondRate: 500,
  minuteRate: 30000,
  // archive matches in (days)
  archive: 7,
  types: ["solo", "flex5v5", "flex3v3", "norm", "bot", "aram", "tft", "special", "custom"]
}