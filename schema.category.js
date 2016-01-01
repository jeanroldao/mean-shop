var mongoose = require('mongoose');

var categorySchema = {
  _id: {type: String, required: true},
  parent: {type: String},
  ancestors: [{type: String}]
};

module.exports = new mongoose.Schema(categorySchema);
module.exports.categorySchema = categorySchema;