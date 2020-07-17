const mongoose = require("../database/database");

let jobSchema = new mongoose.database.Schema({
  name: String
}, {
  collection: 'jobs'
});

module.exports = mongoose.database.model('jobs', jobSchema);
