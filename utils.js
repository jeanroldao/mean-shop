var status = require('http-status');

module.exports = {
  handleOne: function(property, res) {
    return function(error, result) {
      if (error) {
        return res.status(status.INTERNAL_SERVER_ERROR)
                  .json({ error: error.toString() });
      }
      if (!result) {
        return res.status(status.NOT_FOUND)
                  .json({ error: 'Not found' });
      }
      
      var json = {};
      json[property] = result;
      res.json(json);
    }
  },
  
  handleMany: function(property, res) {
    return function(error, results) {
      if (error) {
        return res.status(status.INTERNAL_SERVER_ERROR)
                  .json({ error: error.toString() });
      }
      
      var json = {};
      json[property] = results;
      res.json(json);
    }
  }
};