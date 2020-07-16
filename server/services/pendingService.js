const pageflexModel = require('../models/pageflexModel');
const skyportalModel = require('../models/skyportalModel');
const visionModel = require('../models/visionModel');

// get past 30 days
async function findPendingPageflexOrders() {

	let orders = await pageflexModel.find({ orderStatus: ['Unreviewed', 'Pending Review'] }, function(error, data) {
		if (error) console.log(error);
		return data;
	}).lean();

	let pendingData = [];
	orders.forEach(order => {

		pendingData.push(
			{
				client: order.client,
				orderDate: order.date,
				user: order.user,
				approved: '',
				status: order.orderStatus,
				paid: ''
			}
		);
	});

	return pendingData;
}

// approved status code?
async function findPendingSkyportalOrders() {

	let orders = await skyportalModel.find({paid: 'No', status: ['Order Received', 'Denied'], approved:'Not Approved'}, function(error, data) {
		if (error) console.log(error);
		return data;
	}).lean();

	let pendingData = [];
	orders.forEach(order => {

		pendingData.push(
			{
				client: order.site,
				orderDate: order.requestDate,
				user: order.requestedBy,
				approved: order.approved,
				status: order.status,
				paid: order.paid
			}
		);
	});

	return pendingData;
}

async function findPendingOrders() {

	let pageflexOrders = await findPendingPageflexOrders();
	let skyportalOrders = await findPendingSkyportalOrders();
	let allOrders = [...pageflexOrders, ...skyportalOrders];
	return allOrders;

}

module.exports = {
	findPendingPageflexOrders: findPendingPageflexOrders,
	findPendingSkyportalOrders: findPendingSkyportalOrders,
	findPendingOrders: findPendingOrders
}
