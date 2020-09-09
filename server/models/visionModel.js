const mongoose = require("../database/database");

let visionInvoiceSchema = new mongoose.database.Schema({
  account: String,
  jobNumber: String,
  jobTitle: String,
  location: String,
  wantedDate: Date,
  proofDate: Date,
  takenBy: String,
  salesRep: String,
  link: String,
  dashboardUpdatedAt: Date
}, {
  collection: 'vision'
});

module.exports = mongoose.database.model('vision', visionInvoiceSchema);
