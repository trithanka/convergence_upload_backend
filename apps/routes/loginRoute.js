const express = require("express");
const Router = express.Router();
const co = require("co");
const service = require("../services/loginService");

Router.post("/login", (req, res) => {
    var result = {};
    co(function* () {
      try {
        postParam = req.body;
        
        result = yield service.login(postParam);
        res.send(result);
      } catch (error) { 
        console.log(error);
        res.status(error.statusCode || 500).send(error);
      }
    });
})

Router.post("/generateKey", (req, res) => {

  var result = {};
  co(function* () {
    try {
      postParam = req.body;
      
      result = yield service.generateKey(postParam);
      res.send(result);
    } catch (error) { 
      console.log(error);
      res.status(error.statusCode || 500).send(error);
    }
  });
})
module.exports = Router