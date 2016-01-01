var _ = require('underscore');
var mongodb = require('mongodb');

var config = require('./config.js');

mongodb.MongoClient.connect(config.db_uri, function(error, db) {
  if (error) {
    console.log(error);
    process.exit(1);
  }
    
  
  db.collection('sample').find({x:2}).toArray(function(error, docs){
    if (error) {
      console.log(error);
      process.exit(1);
    }
    
    console.log('Found docs:');
    docs.forEach(function(doc){
      console.log(JSON.stringify(doc));
    });
    
    process.exit(0);
  });
  
});