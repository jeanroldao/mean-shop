var mongoose = require('mongoose');
var Organization = require('./schema.org');

var employeeSchema = {
  name: {type: String, required: true},
  orgId: {type: String, required: true}
};

module.exports = new mongoose.Schema(employeeSchema);
module.exports.employeeSchema = employeeSchema;