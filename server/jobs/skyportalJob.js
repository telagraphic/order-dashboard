const puppeteer = require('puppeteer');
const fs = require("fs");
const mongoose = require('mongoose');
const accounts = require('../config/accounts.js');
const skyportalService = require('../services/skyportalService');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// async function getOrders() {
//
// 	const browser = await puppeteer.launch({
// 		headless: false,
// 		defaultViewport : {
// 			width: 4000,
// 			height: 2000,
// 			timeout: 0
// 		}
// 	});
//
// 	const page = await browser.newPage();
// 	await page.goto('https://admin.chi.v6.pressero.com/authentication/Login');
// 	await page.waitForSelector('.login-form');
//
//
// 	const username = 'input[id="username"]';
// 	const password = 'input[id="password"]';
// 	const loginButton = 'input[id="btnLogin"]';
//
// 	await page.click(username);
// 	await page.keyboard.type(accounts.PRESSERO.username);
//
// 	await page.click(password);
// 	await page.keyboard.type(accounts.PRESSERO.password);
//
// 	await page.click(loginButton);
//
// 	// await page.waitForNavigation({ waitUntil: 'networkidle2' });
//
// 	await page.waitFor(2000);
//
// 	const allOrdersButton = '#sidebar .panel-group .panel:first-child';
// 	await page.click(allOrdersButton);
//
// 	await page.waitFor(2000);
//
// 	const itemPerPage = '.k-pager-sizes .k-select';
// 	await page.click(itemPerPage);
//
// 	await page.waitFor(1000);
//
// 	const itemShow100 = '.k-animation-container .k-list-scroller ul.k-list li:last-child';
// 	await page.click(itemShow100);
//
//
// 	await page.waitFor(2000);
//
// 	const orders = await page.evaluate(() => {
//
// 		// let table = document.querySelector('body.ng-tns-0-65 app-root div.dot-rightpane .dot-form__horizontal');
// 		let presseroOrders = document.querySelectorAll('.page .k-grid-content table tr');
//
// 		let allOrders = [];
//
// 		presseroOrders.forEach(presseroOrder => {
// 			let order = {};
//
// 			order.requestDate = presseroOrder.querySelector('td:nth-child(2)').innerText;
// 			order.orderNumber = presseroOrder.querySelector('td:nth-child(3)').innerText;
// 			order.itemNumber = presseroOrder.querySelector('td:nth-child(4)').innerText;
// 			let orderStatus = presseroOrder.querySelector('td:nth-child(5) select');
// 			order.status = orderStatus.selectedOptions[0].innerText;
// 			// order.progress = presseroOrder.querySelector('td:nth-child(6)').innerText;
// 			// order.reports = presseroOrder.querySelector('td:nth-child(7)').innerText;
// 			order.productName = presseroOrder.querySelector('td:nth-child(8)').innerText;
// 			// order.jobNumber = presseroOrder.querySelector('td:nth-child(9)').innerText;
// 			// order.identifier = presseroOrder.querySelector('td:nth-child(10)').innerText;
// 			order.site = presseroOrder.querySelector('td:nth-child(11)').innerText;
// 			order.requestedShipDate = presseroOrder.querySelector('td:nth-child(12)').innerText;
// 			order.quantity = presseroOrder.querySelector('td:nth-child(13)').innerText;
// 			order.price = presseroOrder.querySelector('td:nth-child(14)').innerText;
// 			order.requestedBy = presseroOrder.querySelector('td:nth-child(16)').innerText;
// 			order.approved = presseroOrder.querySelector('td:nth-child(20) i').getAttribute('alt');
//
// 			let paidColumn = presseroOrder.querySelector('td:nth-child(21) i');
//
// 			if (paidColumn.classList.contains('fa-square-o')) {
// 				order.paid = 'Yes';
// 			} else {
// 				order.paid = 'No';
// 			}
//
// 			order.projectedShipDate = presseroOrder.querySelector('td:nth-child(24)').innerText;
//
// 			allOrders.push(order)
// 		})
//
// 		return allOrders;
//
// 	});
//
// 	// console.log(orders);
//
// 	orders.forEach(order => {
//
// 		skyportalService.upsertOrder({
// 			requestDate: order.requestDate,
// 			orderNumber: order.orderNumber,
// 			itemNumber: order.itemNumber,
// 			productName: order.productName,
// 			status: order.status,
// 			site: order.site,
// 			requestedShipDate: order.requestedShipDate,
// 			quantity: order.quantity,
// 			price: order.price,
// 			customerName: order.customerName,
// 			approved: order.approved,
// 			paid: order.paid,
// 			projectedShipDate: order.projectedShipDate,
// 			dashboardUpdatedAt: new Date()
// 		})
//
// 	})
//
// 	try {
// 		fs.writeFileSync('./feeds/pressero/presseroJob.json', JSON.stringify(orders));
// 	} catch (error) {
// 		console.log(error);
// 	}
//
// 	const signout = '.navbar-right a[href="/authentication/logout"]';
// 	await page.click(signout);
//
// 	await page.waitFor(1000);
//
// 	await browser.close();
// 	process.exit(0);
//
// }


// getOrders();

// module.exports = {
// 	getOrders: getOrders
// }

//
(async () => {
	const browser = await puppeteer.launch({
		headless: false,
		defaultViewport : {
			width: 4000,
			height: 2000,
			timeout: 0
		}
	});

	const page = await browser.newPage();
	await page.goto('https://admin.chi.v6.pressero.com/authentication/Login', {waitUntil: 'load', timeout: 0});
	await page.waitForSelector('.login-form');


	const username = 'input[id="username"]';
	const password = 'input[id="password"]';
	const loginButton = 'input[id="btnLogin"]';

	await page.click(username);
	await page.keyboard.type(accounts.PRESSERO.username);

	await page.click(password);
	await page.keyboard.type(accounts.PRESSERO.password);

	await page.click(loginButton);

	await page.waitFor(2000);

	const allOrdersButton = '#sidebar .panel-group .panel:first-child';
	await page.click(allOrdersButton);

	await page.waitFor(2000);

	const itemPerPage = '.k-pager-sizes .k-select';
	await page.click(itemPerPage);

	await page.waitFor(1000);

	const itemShow100 = '.k-animation-container .k-list-scroller ul.k-list li:last-child';
	await page.click(itemShow100);


	await page.waitFor(2000);

	const orders = await page.evaluate(() => {

		// let table = document.querySelector('body.ng-tns-0-65 app-root div.dot-rightpane .dot-form__horizontal');
		let presseroOrders = document.querySelectorAll('.page .k-grid-content table tr');

		let allOrders = [];

		presseroOrders.forEach(presseroOrder => {
			let order = {};

			order.requestDate = presseroOrder.querySelector('td:nth-child(2)').innerText;
			order.orderNumber = presseroOrder.querySelector('td:nth-child(3)').innerText;
			order.itemNumber = presseroOrder.querySelector('td:nth-child(4)').innerText;
			let orderStatus = presseroOrder.querySelector('td:nth-child(5) select');
			order.status = orderStatus.selectedOptions[0].innerText;
			// order.progress = presseroOrder.querySelector('td:nth-child(6)').innerText;
			// order.reports = presseroOrder.querySelector('td:nth-child(7)').innerText;
			order.productName = presseroOrder.querySelector('td:nth-child(8)').innerText;
			// order.jobNumber = presseroOrder.querySelector('td:nth-child(9)').innerText;
			// order.identifier = presseroOrder.querySelector('td:nth-child(10)').innerText;
			order.site = presseroOrder.querySelector('td:nth-child(11)').innerText;
			order.requestedShipDate = presseroOrder.querySelector('td:nth-child(12)').innerText;
			order.quantity = presseroOrder.querySelector('td:nth-child(13)').innerText;
			order.price = presseroOrder.querySelector('td:nth-child(14)').innerText;
			order.requestedBy = presseroOrder.querySelector('td:nth-child(16)').innerText;
			order.approved = presseroOrder.querySelector('td:nth-child(20) i').getAttribute('alt');

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

	// console.log(orders);

	orders.forEach(order => {

		skyportalService.upsertOrder({
			requestDate: order.requestDate,
			orderNumber: order.orderNumber,
			itemNumber: order.itemNumber,
			productName: order.productName,
			status: order.status,
			site: order.site,
			requestedShipDate: order.requestedShipDate,
			quantity: order.quantity,
			price: order.price,
			customerName: order.customerName,
			approved: order.approved,
			paid: order.paid,
			projectedShipDate: order.projectedShipDate,
			dashboardUpdatedAt: new Date()
		})
	})

	try {
		fs.writeFileSync('./feeds/skyportal/skyportalJob.json', JSON.stringify(orders));
	} catch (error) {
		console.log(error);
	}

	const signout = '.navbar-right a[href="/authentication/logout"]';
	await page.click(signout);

	await page.waitFor(1000);

	await browser.close();
	process.exit(0);

})();
