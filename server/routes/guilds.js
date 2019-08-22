module.exports = (serverList) => {
  var express = require("express");
  var router = express.Router();

  const riot = require('../config/riot');

  router.use((req, res, next) => {
    ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip.substr(0, 7) == "::ffff:") ip = ip.substr(7);
    region = req.headers.host.split(".")[0].replace("http://", "")
    Guild = require('../models/guild')(serverList[region].inhouse);
    next();
  })

  router.get("/all", (req, res) => {
    Guild.find({}, (err, guilds) => {
      if (err) {
        res.status(500).json(err)
      } else {
        res.status(200).json(guilds)
      }
    })
  })

  router.get("/:id", (req, res) => {
    Guild.findOne({guildId: req.params.id}, (err, guild) => {
      if (err) {
        res.status(500).json(err)
      } else if (guild) {
        res.status(200).json(guild)
      } else {
        res.status(400).json("not found")
      }
    })
  })

  router.post("/", (req, res) => {
    var newGuild = new Guild();
    Guild.findOne({guildId: req.body.guildId}, (err, guild) => {
      if (err) {
        res.status(500).json(err)
      } else if (guild) {
        res.status(400).json("already exists")
      } else {
        newGuild.guildId = req.body.guildId;
        newGuild.prefix = ".";
        newGuild.trusted = false;
        newGuild.save((err, guild) => {
          if (err) {
            res.status(500).json(err)
          } else {
            res.status(200).json(guild)
          }
        })
      }
    })
  })

  router.put('/', (req, res) => {
    var guild = new Guild(req.body.guild);
    Guild.findOne({guildId: guild.guildId}, (err, guild) => {
      res.status(200).json(guild);
    })
  })

  return router
}