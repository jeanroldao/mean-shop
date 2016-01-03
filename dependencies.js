var Stripe = require('stripe');
var fx = require('./fx');

module.exports = function(wagner) {
  
  wagner.factory('Stripe', function() {
    return Stripe('sk_test_iyiADRwP1UOvxTVXWStZUFqx');
  });
  
  wagner.factory('fx', fx);
};