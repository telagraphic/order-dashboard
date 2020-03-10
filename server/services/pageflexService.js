const pageflexModel = require('../models/pageflexModel');

function upsertOrder(pageflexOrder) {

	// if this order exists, update the entry, don't insert
	const conditions = { id: pageflexOrder.id };
	const options = { upsert: true, new: true, setDefaultsOnInsert: true };

	pageflexModel.findOneAndUpdate(conditions, pageflexOrder, options, (err, result) => {
		if (err) throw err;
	});
}

async function findOrders(options) {

	let today = new Date();
	let twoWeeksAgo = today.getDate() - 14;
	today.setDate(twoWeeksAgo)

	return pageflexModel.find({date: { $gte: today }}, function(error, data) {
		if (error) console.log(error);
		return data;
	});

}


module.exports = {
  upsertOrder: upsertOrder,
	findOrders: findOrders
}
