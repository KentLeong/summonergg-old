module.exports = (main, static) => {
  var express = require('express');
  var router = express.Router();
  
  const riot = require('../config/riot');
  String.prototype.capitalize = () => {
    return this.charAt(0).toUpperCase() + this.slice(1);
  }
  
  var Rate;
  var region;
  var ip;
  
  router.use((req,res,next) => {
    region = req.headers.host.split(".")[0].replace("http://", "")
    Rate = require("../models/rate")(main[region]);
    next();
  })
  
  router.put('/check', (req,res) => {
    var rateCount = req.body.rate;
    Rate.findOne({rate: "rate"}, (err, rate) => {
      if (err) {return res.status(400).json(err)}
      if (!rate) {
        var newRate = new Rate({rate: "rate"});
        newRate.secondRate = rateCount;
        newRate.minuteRate = rateCount;
        newRate.save((err, rate) => {
          if (err) {return res.status(400).json(err)}
          res.status(200).json(rate)
        })
      } else {
        var tenSeconds = Math.floor((Date.now()-rate.tenSeconds)/1000);
        var tenMinutes = Math.floor((Date.now()-rate.tenMinutes)/1000);
        
        if (tenSeconds > 10) {
          rate.tenSeconds = Date.now();
          rate.secondRate = 0;
        }
        if (tenMinutes > 600) {
          rate.tenMinutes = Date.now();
          rate.minuteRate = 0;
        }
        if (rate.secondRate+rateCount > riot.secondRate || rate.minuteRate+rateCount > riot.minuteRate) {
          rate.save((err, rate) => {
            return res.status(400).json(false)
          })
        } else {
          rate.secondRate += rateCount;
          rate.minuteRate += rateCount;
          rate.save((err, rate) => {
            return res.status(200).json(true)
          })
        }
      }
    })
  })
  return router
}