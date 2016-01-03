/*
module.exports = function() {
  return {
    USD: 1,
    EUR: 1.1,
    GBP: 1.5
  };
};
*/
var superagent = require('superagent');

module.exports = function() {
  var url = 'https://openexchangerates.org/api/latest.json?app_id=1104a599de7e4a62acfa644bc9eb13c6'
  var rates = {
    USD: 1,
    EUR: 1.1,
    GBP: 1.5
  };
  
  var ping = function(callback) {
    superagent.get(url, function(error, res) {
      if (error) {
        callback && callback(error);
        return;
      }
      
      var results;
      try {
        results = JSON.parse(res.text);
        for (var k in results.rates) {
          rates[k] = results.rates[k];
        }
        callback && callback(null, rates);
      } catch (e) {
        callback && callback(e);
      }
    });
  };
  
  setInterval(ping, 60 * 60 * 1000);
  
  var ret = function() {
    return rates;
  }
  ret.ping = ping;
  return ret;
};