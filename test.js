const region = "na";

const Queue = require('./server/service/queue')(region);
const StatService = require('./server/service/stat')(region);
var puuid = "9WX5pU7pGi8EQvSFfC5hsiDJRpqdvmp1Lf57qbq1zSpSIiz38oakVBcFR_dMC2Rd6nbYf4n_pLI8sw"
var main = async () => {
    StatService.get(puuid, stats => {
        console.log(stats.champions)
    })
}

main();