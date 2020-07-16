const mongoose = require("../database/database");

let jobSchema = new mongoose.Schema({
  name: String
}, {
  collection: 'jobs'
});

module.exports = mongoose.model('jobs', jobSchema);
