const pageflexModel = require('../models/pageflexModel');
const dayjs = require('dayjs');

function upsertOrder(pageflexOrder) {
	const conditions = { id: pageflexOrder.id };
	const options = { upsert: true, new: true, setDefaultsOnInsert: true };
	pageflexModel.findOneAndUpdate(conditions, pageflexOrder, options, (err, result) => {
		if (err) throw err;
	});
}

async function findOrders(options) {

	let allOrders = await pageflexModel.find(function(error, data) {
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


async function findPendingOrders(options) {

	return pageflexModel.find({ orderStatus: ['Unreviewed', 'Pending Review'] }, function(error, data) {
		if (error) console.log(error);
		return data;
	})
		.sort({'date': 'desc'})
		.lean();
}

module.exports = {
  upsertOrder: upsertOrder,
	findOrders: findOrders,
	findPendingOrders: findPendingOrders
}
