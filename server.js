const express = require("express");
const path = require("path");
const http = require("http");
const fs = require("fs");
const bodyParser = require("body-parser");
const log = require('./server/config/log');

const riot = require('./server/config/riot');
const app = express();

var mongoose = require('mongoose');

Array.prototype.asyncForEach = async function(cb) {
  for(let i=0; i<this.length; i++) {
    await cb(this[i], i, this)
  }
}


var endpoints = riot.endpoints
var languages = riot.languages
// Parsers for POST data
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// Point static path to dist
app.use(express.static(path.join(__dirname, "dist")));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var connnect = (async () => {
  var main = {};
  var static = {};

  // connect to region mongo db
  log("Connecting to regional enpoints..", 'info')
  await Object.keys(endpoints).asyncForEach(async (endPoint, i) => {
    main[endPoint] = await mongoose.createConnection(endpoints[endPoint].db+"/sgg_"+endPoint, {useNewUrlParser: true});
    log(endpoints[endPoint].name+" connected at host: "+ endpoints[endPoint].db, 'success')
  })

  fs.readdir("./server/routes", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      let fileName = file.split(".")[0];
      var route = require(`./server/routes/${fileName}`)(main, static)
      app.use(`/api/${fileName}`, route)
    })
  })
  setTimeout(()=>{
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, 'dist/index.html'));
    })
  
    const port = process.env.PORT || '80';
    app.set('port', port)
  
    const server = http.createServer(app);
    server.listen(port, () => log("API runnning on localhost:"+port, "complete"))
  }, 500)
})();




