const puppeteer = require('puppeteer');
const fs = require("fs");
const pageflexService = require("../services/pageflexService");
const accounts = require('../config/accounts.js');
const sites = require('../config/sites.js');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


(async () => {

	const start = new Date();
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport : {
      width: 1000,
      height: 10000,
			timeout: 3000000
    }
  });

  const page = await browser.newPage();
  await page.setViewport({width: 1000, height: 1000});

  for (let i = 0; i < sites.sites.list.length; i++) {
    const url = sites.sites.list[i].url;

    const deploymentLoginPromise = page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    await page.goto(`${url}`);
    await deploymentLoginPromise;

    const adminUserName = 'input[name="Username"]';
    const password = 'input[name="Password"]';
    const loginButton = 'input[type="submit"]';

    await page.click(adminUserName);
    await page.keyboard.type(accounts.PAGEFLEX.username);

    await page.click(password);
    await page.keyboard.type(accounts.PAGEFLEX.password);

    await page.click(loginButton);

    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

    const currentURL = page.url();
    const ordersURL = currentURL.replace('AdminHelpOverview', 'AdminOrders');
    await page.goto(ordersURL);

    await page.waitFor('.siteContent');
    // await page.waitFor(3000);


		const dropdownPromise = page.waitForNavigation({ waitUntil: 'domcontentloaded' });
		await page.select('select[name="AdminMaster$ContentPlaceHolderBody$cvcGrid$Grid$ctl01$NumRowsToDisplay"]', '1000');
		await dropdownPromise;
		// await page.waitForNavigation({ waitUntil: 'networkidle2' });

    const orders = await page.evaluate(client => {
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
          client: client,
          id: id,
          orderStatus: orderStatus,
          itemStatus: itemStatus,
          user: user,
          time: time,
          date: date
        });
      };

      return data;

    });

    const client = sites.sites.list[i].client;

    orders.forEach(function(order) {
      order.client = client;

      pageflexService.upsertOrder({
        client: order.client,
        id: order.id,
        orderStatus: order.orderStatus,
        itemStatus: order.itemStatus,
        user: order.user,
        time: order.time,
        date: order.date
      });

    });

		const ordersProduced = [];
		orders.forEach(function(order) {
			if (order.orderStatus.includes("In Process") || order.orderStatus.includes("Completed")) {
				ordersProduced.push(order);
			}
		});

		const csvWriter = createCsvWriter({
		  path: `feeds/pageflex/${client}.csv`,
		  header: [
		    {id: 'client', title: 'Client'},
		    {id: 'id', title: 'ID'},
		    {id: 'orderStatus', title: 'Order Status'},
		    // {id: 'itemStatus', title: 'Item Status'},
				{id: 'user', title: 'User'},
				{id: 'time', title: 'Time'},
				{id: 'date', title: 'Date'}
		  ]
		});

		csvWriter
			.writeRecords(ordersProduced)
			.then(()=> console.log(client + " orders saved..."));


		const logoutButton = '.siteTopNav #AdminMaster_AnchorLogout';
		await page.click(logoutButton);
		await page.waitFor(500);

  }

  await browser.close();
	process.exit(0);

})();