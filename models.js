var mongoose = require('mongoose');

module.exports = function(wagner) {
  mongoose.connection.readyState || mongoose.connect('mongodb://localhost:27017/test');
  
  wagner.factory('Category', function() {
    return mongoose.model('Category', require('./schema.category'), 'categories');
  });
  
  wagner.factory('Product', function() {
    return mongoose.model('Product', require('./schema.product'), 'products');
  });
};