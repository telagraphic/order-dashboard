const visionModel = require('../models/visionModel');

function upsertOrder(visionOrder) {

	// if this order exists, update the entry, don't insert
	const conditions = { jobNumber: visionOrder.jobNumber };
	const options = { upsert: true, new: true, setDefaultsOnInsert: true };

	visionModel.findOneAndUpdate(conditions, visionOrder, options, (err, result) => {
		if (err) throw err;
	});
}

async function findOrders() {

	return visionModel.find(function(error, data) {
		if (error) console.log(error);
		return data;
	}).lean();
}

module.exports = {
  upsertOrder: upsertOrder,
	findOrders: findOrders
}
