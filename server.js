const express = require("express");
const path = require("path");
const http = require("http");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();

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

// import routes
fs.readdir("./server/routes", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let fileName = file.split(".")[0];
    var route = require(`./server/routes/${fileName}`)
    app.use(`/api/${fileName}`, route)
  })
})

setTimeout(()=>{
  app.get("*", (req, res) => {
    ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip.substr(0, 7) == "::ffff:") ip = ip.substr(7);
    console.log(ip)
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  })

  const port = process.env.PORT || '80';
  app.set('port', port)

  const server = http.createServer(app);
  server.listen(port, () => console.log("API runnning on localhost:"+port))
}, 2000)