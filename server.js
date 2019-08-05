const express = require("express");
const path = require("path");
const http = require("http");
const fs = require("fs");
const bodyParser = require("body-parser");
const log = require('./server/config/log');

const riot = require('./server/config/riot');
const app = express();

var mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
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
  var serverList = {};
  // connect to region mongo db
  await Object.keys(endpoints).asyncForEach(async (endPoint, i) => {
    log("Connecting to "+endpoints[endPoint].name+" enpoints..", 'info')
    serverList[endPoint] = {
      main: "",
      match: ""
    }
    try {
      serverList[endPoint].main = await mongoose.createConnection(endpoints[endPoint].main+"/sgg_"+endPoint+"_main", {useNewUrlParser: true})
      log("Connected to "+endpoints[endPoint].name+" main database", 'success')
    } catch(err) {
      log('Connection to '+endpoints[endPoint].name+" main database failed", 'error');
    }
    try {
      serverList[endPoint].match = await mongoose.createConnection(endpoints[endPoint].match+"/sgg_"+endPoint+"_match", {useNewUrlParser: true})
      log("Connected to "+endpoints[endPoint].name+" match database", 'success')
    } catch(err) {
      log('Connection to '+endpoints[endPoint].name+" match database failed", 'error');
    }
    try {
      serverList[endPoint].match = await mongoose.createConnection(endpoints[endPoint].inhouse+"/sgg_"+endPoint+"_inhouse", {useNewUrlParser: true})
      log("Connected to "+endpoints[endPoint].name+" inhouse database", 'success')
    } catch(err) {
      log('Connection to '+endpoints[endPoint].name+" inhouse database failed", 'error');
    }
  })

  fs.readdir("./server/routes", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      let fileName = file.split(".")[0];
      var route = require(`./server/routes/${fileName}`)(serverList)
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




