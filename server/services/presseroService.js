const presseroModel = require('../models/presseroModel');

function upsertOrder(presseroOrder) {
	const conditions = { orderNumber: presseroOrder.orderNumber, itemNumber: presseroOrder.itemNumber };
	const options = { upsert: true, new: true, setDefaultsOnInsert: true };
	presseroModel.findOneAndUpdate(conditions, presseroOrder, options, (err, result) => {
		if (err) throw err;
	});

}

async function findOrders(options) {

	return presseroModel.find(function(error, data) {
		if (error) console.log(error);
		return data;
	});

}

module.exports = {
  upsertOrder: upsertOrder,
	findOrders: findOrders
}
