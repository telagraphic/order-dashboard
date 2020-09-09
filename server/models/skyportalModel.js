const mongoose = require("../database/database");

const skyportalOrderSchema = new mongoose.database.Schema({
  requestDate: Date,
  orderNumber: String,
  itemNumber: String,
  productName: String,
  status: String,
  site: String,
  quantity: String,
  price: String,
  requestedBy: String,
  approved: String,
  paid: String,
  projectedShipDate: Date,
  dashboardUpdatedAt: Date
}, {
  collection: 'skyportal'
});

module.exports = mongoose.database.model('skyportal', skyportalOrderSchema);
