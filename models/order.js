const mongoose = require('mongoose');

let orderSchema = new mongoose.Schema({
    client: String,
    id: String,
    orderStatus: String,
    itemStatus: String,
    user: String,
    time: String,
    date: Date
});

let Order = mongoose.model('Order', orderSchema);

module.exports = Order;
