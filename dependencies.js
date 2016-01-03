var Stripe = require('stripe');

module.exports = function(wagner) {
  
  wagner.factory('Stripe', function() {
    return Stripe('sk_test_iyiADRwP1UOvxTVXWStZUFqx');
  });
};