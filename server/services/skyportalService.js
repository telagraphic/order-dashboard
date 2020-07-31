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

	// return skyportalModel.find(function(error, data) {
	// 	if (error) console.log(error);
	// 	return data;
	// }).lean();


	let allOrders = await skyportalModel.find(function(error, data) {
		if (error) console.log(error);
		return data;
	}).lean();

	let oldDate = dayjs().subtract(1, "month");
	console.log(oldDate);

	let lastThirtyDayOrders = allOrders.filter(order => {
		console.log(dayjs(order.date));
		return dayjs(order.date) >= dayjs().subtract(1, "month");
	});

	return lastThirtyDayOrders;

}

module.exports = {
  upsertOrder: upsertOrder,
	findOrders: findOrders
}
