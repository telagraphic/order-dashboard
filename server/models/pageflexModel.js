const mongoose = require("../database/database");

let pageflexOrderSchema = new mongoose.database.Schema({
  client: String,
  id: String,
  orderStatus: String,
  itemStatus: String,
  user: String,
  time: String,
  date: Date,
  link: String,
  dashboardUpdatedAt: Date
}, {
  collection: 'pageflex'
});

module.exports = mongoose.database.model('pageflex', pageflexOrderSchema);
