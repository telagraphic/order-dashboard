const puppeteer = require('puppeteer');
const fs = require("fs");
const path = require('path');
const accounts = require('../config/accounts.js');
const visionService = require('../services/visionService');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

async function getOrders() {
	(async () => {

		const start = new Date();
	  const browser = await puppeteer.launch({
	    headless: true,
	    defaultViewport : {
	      width: 4000,
	      height: 2000,
				timeout: 3000000
	    }
	  });

	  const page = await browser.newPage();

		const visionLoginPromise = page.waitForNavigation({ waitUntil: 'domcontentloaded' });
		await page.goto('https://vision.gsbdigital.com:8443/PrintSmith/PrintSmithLogin.html');
		await visionLoginPromise;

	  const adminUserName = 'input[id="userName"]';
	  const password = 'input[id="password"]';
	  const loginButton = 'input[id="loginBtn"]';

	  await page.click(adminUserName);
	  await page.keyboard.type(accounts.PRINTSMITH.username);

	  await page.click(password);
	  await page.keyboard.type(accounts.PRINTSMITH.password);

	  await page.click(loginButton);

	  await page.waitForNavigation({ waitUntil: 'networkidle2' });

		await page.waitFor(2000);

		const pendingDocumentsButton = '#menuUL li.menuLI';
		await page.click(pendingDocumentsButton);
		await page.waitFor(2000);

		const pendingDocumentsInvoiceLink = '.pending-list-header .pending-list-group-invoice';
		await page.click(pendingDocumentsInvoiceLink);
		await page.waitFor(2000);

		const dropdownList = '[name="due_date_filter"]';
		await page.click(dropdownList);
		await page.waitFor(2000);
		const dueTodayOption = 'li[id$="-DueToday"]';
		await page.click(dueTodayOption);

		await page.waitFor(2000);

		const showRecordsSelect = '.ui-paginator-bottom .ui-dropdown-trigger-icon';
		await page.click(showRecordsSelect);

		await page.waitFor(2000);

		const showRecordsOption = '.ui-dropdown-items-wrapper .ui-dropdown-items p-dropdownitem:last-child';
		await page.click(showRecordsOption);

		await page.waitFor(5000);

		const visionInvoices = await page.evaluate(() => {

			let webInvoices = document.querySelectorAll('body table tbody.ui-datatable-data tr');

			let invoicesToSave = [];

			webInvoices.forEach(invoice => {
				let job = {};

				job.account = invoice.querySelector('td:nth-child(2)').innerText;
				job.jobNumber = invoice.querySelector('td:nth-child(3)').innerText;
				job.jobTitle = invoice.querySelector('td:nth-child(4)').innerText;
				// job.location = invoice.querySelector('td:nth-child(7) .k-input').innerText;

				job.takenBy = invoice.querySelector('td:nth-child(12)').innerText;
				job.salesRep = invoice.querySelector('td:nth-child(13)').innerText;

				invoicesToSave.push(job)
			})

			return invoicesToSave;

		});

		const visionLink = 'https://vision.gsbdigital.com:8443/PrintSmith/nextgen/en_US/#/workin-progress';

		visionInvoices.forEach(invoice => {
			visionService.upsertOrder({
				account: invoice.account || '',
				jobNumber: invoice.jobNumber || '',
				jobTitle: invoice.jobTitle || '',
				// wantedDate: invoice.wantedDate,
				// location: invoice.location,
		    takenBy: invoice.takenBy || '',
		    salesRep: invoice.salesRep || '',
				link: visionLink,
				dashboardUpdatedAt: new Date()
			})
		});

		const usernameDropdown = 'span[name="user-options-dropdown-container"]';
		await page.hover(usernameDropdown);

		await page.waitFor(3000);

		const signout = '.username-icon .dot-dropdown-options-items li:nth-child(3) a';
		await page.click(signout);

		await page.waitFor(1000);

		try {
			fs.writeFileSync('./feeds/vision/visionJob.json', JSON.stringify(visionInvoices));
		} catch (error) {
			console.log(error);
		}


	  await browser.close();
		process.exit(0);

	})();
}

module.exports = {
	getOrders: getOrders
};
