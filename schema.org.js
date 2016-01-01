var mongoose = require('mongoose');

var organizationSchema = {
  _id: {type: String, required: true}
  name: {type: String, required: true}
};

module.exports = new mongoose.Schema(organizationSchema);
module.exports.organizationSchema = organizationSchema;