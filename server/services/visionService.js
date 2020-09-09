const visionModel = require('../models/visionModel');
const dayjs = require('dayjs');

function upsertOrder(visionOrder) {
	const conditions = { jobNumber: visionOrder.jobNumber };
	const options = { upsert: true, new: true, setDefaultsOnInsert: true };

	visionModel.findOneAndUpdate(conditions, visionOrder, options, (err, result) => {
		if (err) throw err;
	});
}

async function findOrders() {
	let allOrders = await visionModel.find(function(error, data) {
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
