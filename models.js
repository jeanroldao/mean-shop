var mongoose = require('mongoose');

module.exports = function(wagner) {
  mongoose.connect('mongodb://localhost:27017/test');
  
  wagner.factory('Category', function() {
    return mongoose.model('Category', require('./schema.category'), 'categories');
  });
};