var express = require('express');

module.exports = function() {
  var app = express();
  
  app.get('/', function(req, res) {
    res.send('Hello, world!');
  });
  
  app.get('/user/:user', function(req, res) {
    var user = req.params.user;
    var s = req.query.s;
    
    res.send('This is user ' + user + ', asking for ' + s);
  });
  
  return app;
};