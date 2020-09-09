const skyportalModel = require('../models/skyportalModel');
const dayjs = require('dayjs');

function upsertOrder(presseroOrder) {
	const conditions = { orderNumber: presseroOrder.orderNumber, itemNumber: presseroOrder.itemNumber };
	const options = { upsert: true, new: true, setDefaultsOnInsert: true };
	skyportalModel.findOneAndUpdate(conditions, presseroOrder, options, (err, result) => {
		if (err) throw err;
	});

}

async function findOrders(options) {

	let allOrders = await skyportalModel.find(function(error, data) {
		if (error) console.log(error);
		return data;
	})
		.sort({'date': 'desc'})
		.lean();

	let lastThirtyDayOrders = allOrders.filter(order => {
		return dayjs(order.date) >= dayjs().subtract(2, "month");
	});

	return lastThirtyDayOrders;

}

module.exports = {
  upsertOrder: upsertOrder,
	findOrders: findOrders
}
