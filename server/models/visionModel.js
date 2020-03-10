const mongoose = require("../database/database");

let visionInvoiceSchema = new mongoose.Schema({
  account: String,
  jobNumber: String,
  jobTitle: String,
  location: String,
  wantedDate: String,
  proofDate: String,
  takenBy: String,
  salesRep: String,
  dashboardUpdatedAt: Date
}, {
  collection: 'vision'
});

module.exports = mongoose.model('vision', visionInvoiceSchema);
