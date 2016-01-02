var mongoose = require('mongoose');

var categorySchema = {
  _id: {type: String, required: true},
  parent: String,
  ancestors: [String]
};

module.exports = new mongoose.Schema(categorySchema);
module.exports.categorySchema = categorySchema;