const puppeteer = require('puppeteer');
const fs = require("fs");
const mongoose = require('mongoose');
const accounts = require('../config/accounts.js');
const skyportalService = require('../services/skyportalService');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const skyportal = {
	browser: null,
	page: null,
	options: {
		headless: false,
		defaultViewport : null
	},
	pageURL: 'https://admin.chi.v6.pressero.com/authentication/Login',

	initialize: async () => {
		skyportal.browser = await puppeteer.launch(skyportal.options);
		skyportal.page = await skyportal.browser.newPage();

		console.log("...logging in");
		skyportal.page.goto(skyportal.pageURL, {waitUntil: 'load', timeout: 0});
		await skyportal.page.waitForSelector('.login-form');

		const username = 'input[id="username"]';
		const password = 'input[id="password"]';
		const loginButton = 'input[id="btnLogin"]';

		await skyportal.page.click(username);
		await skyportal.page.keyboard.type(accounts.SKYPORTAL.username);

		await skyportal.page.click(password);
		await skyportal.page.keyboard.type(accounts.SKYPORTAL.password);

		await skyportal.page.click(loginButton);

		await skyportal.page.waitForNavigation({waitUntil:'networkidle0'});

		const allOrdersButton = '#sidebar .panel-group .panel:first-child';
		await skyportal.page.click(allOrdersButton);

		await skyportal.page.waitFor(2000);

		const itemPerPage = '.k-pager-sizes .k-select';
		await skyportal.page.click(itemPerPage);

		await skyportal.page.waitFor(1000);

		const itemShow100 = '.k-animation-container .k-list-scroller ul.k-list li:last-child';
		await skyportal.page.click(itemShow100);


		await skyportal.page.waitFor(2000);
	},
	scrapePages: async () => {

		let pageCount = await skyportal.page.evaluate(() => {
      let pageNumbers = document.querySelectorAll('.k-pager-wrap .k-pager-numbers li:not(.k-current-page)');
      return pageNumbers.length;
    });

    let allOrders = [];

    for (let index = 0; index < pageCount; index++) {
      await skyportal.page.waitFor(3000);
      console.log(`scraping page ${index+1}`);
      allOrders = allOrders.concat(await skyportal.getOrders());
      if (index != pageCount - 1) {
        await skyportal.page.click('.k-pager-wrap a[title="Go to the next page"]');
        await skyportal.page.waitFor(3000);
      }
    }

    return allOrders;
	},
	getOrders: async () => {
		console.log("...getting orders");
		const orders = await skyportal.page.evaluate(() => {

			let presseroOrders = document.querySelectorAll('.page .k-grid-content table tr');

			let allOrders = [];

			presseroOrders.forEach(presseroOrder => {
				let order = {};
				order.requestDate = presseroOrder.querySelector('td:nth-child(2)').innerText;
				order.orderNumber = presseroOrder.querySelector('td:nth-child(3)').innerText;
				order.itemNumber = presseroOrder.querySelector('td:nth-child(4)').innerText;
				let orderStatus = presseroOrder.querySelector('td:nth-child(5) select');
				order.status = orderStatus.selectedOptions[0].innerText;
				order.productName = presseroOrder.querySelector('td:nth-child(8)').innerText;
				order.site = presseroOrder.querySelector('td:nth-child(11)').innerText;
				order.requestedShipDate = presseroOrder.querySelector('td:nth-child(12)').innerText;
				order.quantity = presseroOrder.querySelector('td:nth-child(13)').innerText;
				order.price = presseroOrder.querySelector('td:nth-child(14)').innerText;
				order.requestedBy = presseroOrder.querySelector('td:nth-child(16)').innerText;
				order.approved = presseroOrder.querySelector('td:nth-child(20) i').getAttribute('alt'); // might need to check for fa-check = approved, fa-square-o = not approved
				let paidColumn = presseroOrder.querySelector('td:nth-child(21) i');

				if (paidColumn.classList.contains('fa-square-o')) {
					order.paid = 'Yes';
				} else {
					order.paid = 'No';
				}

				order.projectedShipDate = presseroOrder.querySelector('td:nth-child(24)').innerText;

				allOrders.push(order)
			})

			return allOrders;
		});

		return orders;

	},
	saveOrders: async (orders) => {
		console.log("...savings orders");
		orders.forEach(order => {

			let [reqmonth, reqday, reqyear] = order.requestDate.split("/");
			let [shipmonth, shipday, shipyear] = order.requestedShipDate.split("/");
			let [projectedmonth, projectedday, projectedyear] = order.projectedShipDate.split("/");

			skyportalService.upsertOrder({
				requestDate: new Date(reqyear, reqmonth - 1, reqday),
				orderNumber: order.orderNumber,
				itemNumber: order.itemNumber,
				productName: order.productName,
				status: order.status,
				site: order.site,
				quantity: order.quantity,
				price: order.price,
				customerName: order.customerName,
				approved: order.approved,
				paid: order.paid,
				projectedShipDate: new Date(projectedyear, projectedmonth - 1, projectedday),
				dashboardUpdatedAt: new Date()
			})
		});

	},

	signOut: async () => {
		const signout = '.navbar-right a[href="/authentication/logout"]';
		await skyportal.page.click(signout);
		console.log("..signing out");
		await skyportal.page.waitFor(1000);
		await skyportal.browser.close();
		process.exit(0);
	}
}

async function getOrders() {
	await skyportal.initialize();
	let orders = await skyportal.scrapePages();
	await skyportal.saveOrders(orders);
	await skyportal.signOut();
}

module.exports = {
	getOrders: getOrders
};
