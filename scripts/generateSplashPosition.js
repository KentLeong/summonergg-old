const fs = require("fs")
var main = (async () => {
  var list = {};
  fs.readdir("../src/assets/champion/splash", (err, files) => {
    var len = files.length;
    files.forEach((file, i) => {
      if (err) return console.error(err);
      let fileName = file.split(".")[0];
      var champion = fileName.split("_")[0]
      var skin = fileName.split("_")[1]
      if (!list[champion]) {
        list[champion] = {};
        list[champion][skin] = 0;
      } else {
        list[champion][skin] = 0;
      }
      if (i+1 == len) {
        let data = JSON.stringify(list);
        //warning this will overwrite current one
        // fs.writeFileSync('../server/static/temp.json', data);
      }
    })
  })
})();