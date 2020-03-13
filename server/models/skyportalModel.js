const mongoose = require("../database/database");

const skyportalOrderSchema = new mongoose.Schema({
  requestDate: String,
  orderNumber: String,
  itemNumber: String,
  productName: String,
  status: String,
  site: String,
  requestedShipDate: String,
  quantity: String,
  price: String,
  requestedBy: String,
  approved: String,
  paid: String,
  projectedShipDate: String,
  dashboardUpdatedAt: Date
}, {
  collection: 'skyportal'
});

module.exports = mongoose.model('skyportal', skyportalOrderSchema);


// module.exports = {
//   pressero: presseroOrder
// };
