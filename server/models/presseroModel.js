const mongoose = require("../database/database");

const presseroOrderSchema = new mongoose.Schema({
  requestDate: String,
  orderNumber: String,
  itemNumber: String,
  productName: String,
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
  collection: 'pressero'
});

module.exports = mongoose.model('pressero', presseroOrderSchema);


// module.exports = {
//   pressero: presseroOrder
// };
