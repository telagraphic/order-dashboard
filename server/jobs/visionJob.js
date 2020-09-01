const puppeteer = require('puppeteer');
const fs = require("fs");
const path = require('path');
const accounts = require('../config/accounts.js');
const visionService = require('../services/visionService');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const vision = {
	browser: null,
	page: null,
	options: {
		headless: false,
		defaultViewport : {
			width: 4000,
			height: 2000
		}
	},
	loginPage: accounts.PRINTSMITH.login,

	initialize: async () => {
		vision.browser = await puppeteer.launch(vision.options);
		vision.page = await vision.browser.newPage();
	},
	signIn: async () => {
		console.log("logging in...");

		await vision.page.goto(vision.loginPage, {waitUntil: 'load', timeout: 0});
		// await vision.page.waitForNavigation({ waitUntil: 'domcontentloaded' });

		const adminUserName = 'input[id="userName"]';
		const password = 'input[id="password"]';
		const loginButton = 'input[id="loginBtn"]';

		await vision.page.click(adminUserName);
		await vision.page.keyboard.type(accounts.PRINTSMITH.username);

		await vision.page.click(password);
		await vision.page.keyboard.type(accounts.PRINTSMITH.password);

		await vision.page.click(loginButton);

		await vision.page.waitForNavigation({ waitUntil: 'networkidle2' });

	},
	goToPendingJobs: async () => {
		console.log("go to pending jobs...");
		const pendingDocumentsButton = '#menuUL li.menuLI:nth-child(3)';
		await vision.page.click(pendingDocumentsButton);
		await vision.page.waitFor(2000);

		// const pendingDocumentsInvoiceLink = '.pending-list-header .pending-list-group-invoice';
		// await vision.page.click(pendingDocumentsInvoiceLink);
		// await vision.page.waitFor(2000);
	},
	viewJobsForToday: async () => {
		console.log("filtering for today...");
		const dropdownList = '[name="due_date_filter"]';
		await vision.page.click(dropdownList);
		await vision.page.waitFor(4000);
		const dueTodayOption = 'li[id$="-DueToday"]';
		await vision.page.click(dueTodayOption);

		await vision.page.waitFor(2000);

		const showRecordsSelect = '.ui-paginator-bottom .ui-dropdown-trigger-icon';
		await vision.page.click(showRecordsSelect);

		await vision.page.waitFor(2000);

		const showRecordsOption = '.ui-dropdown-items-wrapper .ui-dropdown-items p-dropdownitem:last-child';
		await vision.page.click(showRecordsOption);

		await vision.page.waitFor(2000);
	},
	getJobs: async () => {
		console.log("scraping jobs...");

		const visionInvoices = await vision.page.evaluate(() => {
			let webInvoices = document.querySelectorAll('body table tbody.ui-datatable-data tr');
			let invoicesToSave = [];

			webInvoices.forEach(invoice => {
				let job = {};

				job.account = invoice.querySelector('td:nth-child(2)').innerText;
				job.jobNumber = invoice.querySelector('td:nth-child(3)').innerText;
				job.jobTitle = invoice.querySelector('td:nth-child(4)').innerText;
				job.wantedDate = invoice.querySelector('td:nth-child(10) input').value;
				job.takenBy = invoice.querySelector('td:nth-child(12)').innerText;
				job.salesRep = invoice.querySelector('td:nth-child(13)').innerText;

				invoicesToSave.push(job)
			})

			return invoicesToSave;
		});

		return visionInvoices;

	},
	saveJobs: async (visionInvoices) => {
		console.log("saving jobs...");
		const visionLink = 'https://vision.gsbdigital.com:8443/PrintSmith/nextgen/en_US/#/workin-progress';

		visionInvoices.forEach(invoice => {
			visionService.upsertOrder({
				account: invoice.account || '',
				jobNumber: invoice.jobNumber || '',
				jobTitle: invoice.jobTitle || '',
				wantedDate: invoice.wantedDate,
				takenBy: invoice.takenBy || '',
				salesRep: invoice.salesRep || '',
				link: visionLink,
				dashboardUpdatedAt: new Date()
			})
		});

		// try {
		// 	fs.writeFileSync('./feeds/vision/visionJob.json', JSON.stringify(visionInvoices));
		// } catch (error) {
		// 	console.log(error);
		// }

	},
	signOut: async () => {
		console.log("...signed out");
		const usernameDropdown = 'span[name="user-options-dropdown-container"]';
		await vision.page.hover(usernameDropdown);

		await vision.page.waitFor(3000);

		const signout = '.username-icon .dot-dropdown-options-items li:nth-child(3) a';
		await vision.page.click(signout);

		await vision.page.waitFor(1000);

		await vision.browser.close();
		process.exit(0);
	}
}

async function getVisionJobs() {
	await vision.initialize();
	await vision.signIn();
	await vision.goToPendingJobs();
	await vision.viewJobsForToday();
	let visionJobs = await vision.getJobs();
	await vision.saveJobs(visionJobs);
	await vision.signOut();
}


// getVisionJobs();


module.exports = {
	getOrders: getVisionJobs
};
