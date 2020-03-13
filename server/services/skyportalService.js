const skyportalModel = require('../models/skyportalModel');

function upsertOrder(presseroOrder) {
	const conditions = { orderNumber: presseroOrder.orderNumber, itemNumber: presseroOrder.itemNumber };
	const options = { upsert: true, new: true, setDefaultsOnInsert: true };
	skyportalModel.findOneAndUpdate(conditions, presseroOrder, options, (err, result) => {
		if (err) throw err;
	});

}

async function findOrders(options) {

	return skyportalModel.find(function(error, data) {
		if (error) console.log(error);
		return data;
	}).lean();

}

module.exports = {
  upsertOrder: upsertOrder,
	findOrders: findOrders
}
