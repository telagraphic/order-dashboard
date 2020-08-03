const fs = require("fs");
const puppeteer = require('puppeteer');
const pageflexService = require("../services/pageflexService");
const accounts = require('../config/accounts.js');
const sites = require('../config/sites.js');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


const pageflex = {
	browser: null,
	page: null,
	options: {
		headless: false,
		defaultViewport : {
			width: 4000,
			height: 2000,
			timeout: 0
		}
	},

	initialize: async () => {
		pageflex.browser = await puppeteer.launch(pageflex.options);
		pageflex.page = await pageflex.browser.newPage();

		await pageflex.page.setViewport({width: 1000, height: 1000});
		await pageflex.page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
		await pageflex.page.setDefaultNavigationTimeout(0);

	},

	scrapeDeploymentOrders: async () => {
		for (let i = 0; i < sites.sites.list.length; i++) {
			let url = sites.sites.list[i].url;
			let clientName = sites.sites.list[i].client;
			await pageflex.login(clientName, url);
		}
	},

	login: async (clientName, url) => {
		const deploymentLoginPromise = pageflex.page.waitForNavigation({ waitUntil: 'domcontentloaded' });
		await pageflex.page.goto(`${url}`);
		await deploymentLoginPromise;

		const adminUserName = 'input[name="Username"]';
		const password = 'input[name="Password"]';
		const loginButton = 'input[type="submit"]';

		await pageflex.page.click(adminUserName);
		await pageflex.page.keyboard.type(accounts.PAGEFLEX.username);

		await pageflex.page.click(password);
		await pageflex.page.keyboard.type(accounts.PAGEFLEX.password);

		await pageflex.page.click(loginButton);

		await pageflex.page.waitForNavigation({ waitUntil: 'domcontentloaded' });

		const currentURL = pageflex.page.url();
		const ordersURL = currentURL.replace('AdminHelpOverview', 'AdminOrders');
		await pageflex.page.goto(ordersURL);

		await pageflex.page.waitFor('.siteContent');

		const dropdownPromise = pageflex.page.waitForNavigation({ waitUntil: 'domcontentloaded' });
		await pageflex.page.select('select[name="AdminMaster$ContentPlaceHolderBody$cvcGrid$Grid$ctl01$NumRowsToDisplay"]', '1000');
		await dropdownPromise;

		await pageflex.scrapeOrders(clientName, url);
	},
	scrapeOrders: async (clientName, url) => {
		console.log("...getting pageflex orders");
		const orders = await pageflex.page.evaluate(url => {
			let rows = document.querySelectorAll('table.EnhancedDataGrid tr[valign="top"]');

			let data = [];
			let i;
			for (i = 0; i < rows.length; i++) {
				let id = rows[i].children[1].innerText.trim();
				let orderStatus = rows[i].children[2].innerText.trim();
				let itemStatus = rows[i].children[3].innerText.trim();
				let user = rows[i].children[4].innerText.trim();
				let time = rows[i].children[5].innerText.split(" ")[1]
				let date = rows[i].children[5].innerText.split(" ")[0];

				data.push({
					id: id,
					orderStatus: orderStatus,
					itemStatus: itemStatus,
					user: user,
					time: time,
					date: date,
					link: url
				});
			};
			return data;
		});

		orders.forEach(order => { order.client = clientName});
		await pageflex.saveOrders(orders);
	},

	saveOrders: async (orders) => {
		console.log("...saving orders");
		orders.forEach(function(order) {
			let [month, day, year] = order.date.split("/");

			pageflexService.upsertOrder({
				client: order.client,
				id: order.id,
				orderStatus: order.orderStatus,
				itemStatus: order.itemStatus,
				user: order.user,
				time: order.time,
				date: new Date(year, month - 1, day),
				link: order.link
			});

		});

		// const ordersProduced = [];
		// orders.forEach(function(order) {
		// 	if (order.orderStatus.includes("In Process") || order.orderStatus.includes("Completed")) {
		// 		ordersProduced.push(order);
		// 		console.log(order.client);
		// 	}
		// });
		//
		// const csvWriter = createCsvWriter({
		// 	path: `feeds/pageflex/${client}.csv`,
		// 	header: [
		// 		{id: 'client', title: 'Client'},
		// 		{id: 'id', title: 'ID'},
		// 		{id: 'orderStatus', title: 'Order Status'},
		// 		{id: 'user', title: 'User'},
		// 		{id: 'time', title: 'Time'},
		// 		{id: 'date', title: 'Date'}
		// 	]
		// });
		//
		// csvWriter
		// 	.writeRecords(ordersProduced)
		// 	.then(()=> console.log(client + " orders saved..."));

	},

	signOut: async () => {
		const logoutButton = '.siteTopNav #AdminMaster_AnchorLogout';
		await pageflex.page.click(logoutButton);
		await pageflex.page.waitFor(500);
	},

	closeBrowser: async () => {
		await browser.close();
		process.exit(0);
	}

}

async function getOrders() {
	await pageflex.initialize();
	await pageflex.scrapeDeploymentOrders();
	await pageflex.signOut();
	await pageflex.closeBrowser();
}

module.exports = {
	getOrders: getOrders
};
