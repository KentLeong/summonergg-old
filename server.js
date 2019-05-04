const express = require("express");
const path = require("path");
const http = require("http");
const fs = require("fs");
const bodyParser = require("body-parser");
const config = require("./config");
const mongoose = require("mongoose");

const app = express();
const db = config.mongoURI;

mongoose
  .connect(db, {useNewUrlParser: true})
  .then(()=> console.log("Mongodb connected"))
  .catch(err => console.error(err))

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Point static path to dist
app.use(express.static(path.join(__dirname, "dist")));

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
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  })

  const port = process.env.PORT || '3000';
  app.set('port', port)

  const server = http.createServer(app);
  server.listen(port, () => console.log("API runnning on localhost:"+port))
}, 2000)