const puppeteer = require('puppeteer');
const fs = require("fs");
const mongoose = require('mongoose');
const Job = require("./models/job");
const accounts = require('./scripts/account.js');
const sites = require('./scripts/sites.js');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
// const shadowDom = require('query-selector-shadow-dom');

function upsertJob(job) {

	const DB_URL = 'mongodb://127.0.0.1:27017/print-vision-jobs';

	if (mongoose.connection.readyState == 0) {
		mongoose.connect(DB_URL, { useNewUrlParser: true, useFindAndModify: false });
	}

	// if this email exists, update the entry, don't insert
	const conditions = { id: order.id };
	const options = { upsert: true, new: true, setDefaultsOnInsert: true };

	Job.findOneAndUpdate(conditions, order, options, (err, result) => {
		if (err) throw err;
	});
}


(async () => {

	const start = new Date();
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport : {
      width: 4000,
      height: 2000,
			timeout: 3000000
    }
  });

  const page = await browser.newPage();

	const deploymentLoginPromise = page.waitForNavigation({ waitUntil: 'domcontentloaded' });
	await page.goto('https://vision.gsbdigital.com:8443/PrintSmith/PrintSmithLogin.html');
	await deploymentLoginPromise;

  const adminUserName = 'input[id="userName"]';
  const password = 'input[id="password"]';
  const loginButton = 'input[id="loginBtn"]';

  await page.click(adminUserName);
  await page.keyboard.type(accounts.PRINTSMITH.username);

  await page.click(password);
  await page.keyboard.type(accounts.PRINTSMITH.password);

  await page.click(loginButton);

  await page.waitForNavigation({ waitUntil: 'networkidle2' });

	// await page.waitFor(3000);

	await page.waitFor(2000);

	const pendingDocumentsButton = 'div[name="menuitem_3"] > span.quick-access-item-text';
	await page.click(pendingDocumentsButton);

	// await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
	await page.waitFor(2000);

	const dropdownList = '[name="due_date_filter"]';
	await page.click(dropdownList);
	await page.waitFor(2000);
	const dueTodayOption = 'li[id$="-DueToday"]';
	await page.click(dueTodayOption);

	await page.waitFor(2000);

	const jobs = await page.evaluate(() => {

		// let table = document.querySelector('body.ng-tns-0-65 app-root div.dot-rightpane .dot-form__horizontal');
		let currentInvoices = document.querySelectorAll('body.ng-tns-0-65 app-root tbody.ui-datatable-data tr');

		let invoices = [];

		currentInvoices.forEach(invoice => {
			let job = {};

			job.account = invoice.querySelector('td:nth-child(2)').innerText;
			job.jobNumber = invoice.querySelector('td:nth-child(3)').innerText;
			job.jobTitle = invoice.querySelector('td:nth-child(4)').innerText;
			// job.location = invoice.querySelector('td:nth-child(7) input.k-input').innerText;
			// job.wanted = invoice.querySelector('td:nth-child(10)').innerText;
			job.takenBy = invoice.querySelector('td:nth-child(12)').innerText;
			job.salesRep = invoice.querySelector('td:nth-child(13)').innerText;

			invoices.push(job)
		})

		return invoices;

	});

	console.log(jobs);

	fs.writeFileSync('./jobs/jobs.json', JSON.stringify(jobs));


  // await browser.close();

	// process.exit(0);

})();
