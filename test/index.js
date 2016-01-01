var assert = require('assert');
var superagent = require('superagent');
var app = require('../server_app');

describe("server", function() {
  var server;
  
  beforeEach(function(){
    server = app().listen(3000);
  });
  
  afterEach(function(){
    server.close();
  });
  
  it('prints "Hello, world!"', function(done) {
    superagent.get('http://localhost:3000/', function(error, res) {
      assert.ifError(error);
      assert.equal(res.status, 200);
      assert.equal(res.text, "Hello, world!");
      
      done();
    });
  });
  
  it('prints "This is user Someone, asking for nothing"', function(done) {
    superagent.get('http://localhost:3000/user/Someone?s=nothing', function(error, res) {
      assert.ifError(error);
      assert.equal(res.status, 200);
      assert.equal(res.text, "This is user Someone, asking for nothing");
      
      done();
    });
  });
    
});