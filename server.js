const express = require("express");
const path = require("path");
const http = require("http");
const fs = require("fs");
const bodyParser = require("body-parser");

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

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
  await Object.keys(endpoints).asyncForEach(async (endPoint, i) => {
    main[endPoint] = await mongoose.createConnection("mongodb://localhost:27017/sgg_"+endPoint, {useNewUrlParser: true});
    console.log(endPoint+" connected")
  })

  // connect to static mongo db
  await Object.keys(languages).asyncForEach(async (language, i) => {
    static[language] = await mongoose.createConnection("mongodb://localhost:27017/static_"+language, {useNewUrlParser: true})
    console.log("static_"+language+" connected")
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
    server.listen(port, () => console.log("API runnning on localhost:"+port))
  }, 1500)
})();




