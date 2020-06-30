const mongoose = require("../database/database");

let pageflexOrderSchema = new mongoose.Schema({
  client: String,
  id: String,
  orderStatus: String,
  itemStatus: String,
  user: String,
  time: String,
  date: Date,
  dashboardUpdatedAt: Date
}, {
  collection: 'pageflex'
});

module.exports = mongoose.model('pageflex', pageflexOrderSchema);
