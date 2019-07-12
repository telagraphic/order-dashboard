const puppeteer = require('puppeteer');
const fs = require("fs");
const mongoose = require('mongoose');
const Order = require("./models/order");
const accounts = require('./account.js');
const sites = require('./sites.js');

function upsertOrder(order) {

	const DB_URL = 'mongodb://127.0.0.1:27017/pageflex-orders';

	if (mongoose.connection.readyState == 0) {
		mongoose.connect(DB_URL, { useNewUrlParser: true, useFindAndModify: false });
	}

	// if this email exists, update the entry, don't insert
	const conditions = { id: order.id };
	const options = { upsert: true, new: true, setDefaultsOnInsert: true };

	Order.findOneAndUpdate(conditions, order, options, (err, result) => {
		if (err) throw err;
	});
}


(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport : {
      width: 1000,
      height: 5000
    }
  });

  const page = await browser.newPage();
  await page.setViewport({width: 1000, height: 1000});

  for (let i = 0; i < sites.sites.list.length; i++) {
      const url = sites.sites.list[i].url;

      const promise = page.waitForNavigation({ waitUntil: 'networkidle2' });
      await page.goto(`${url}`);
      await promise;

      const adminUserName = 'input[name="Username"]';
      const password = 'input[name="Password"]';
      const loginButton = 'input[type="submit"]';

      await page.click(adminUserName);
      await page.keyboard.type(accounts.ADMIN.username);

      await page.click(password);
      await page.keyboard.type(accounts.ADMIN.password);

      await page.click(loginButton);

      await page.waitForNavigation();

      const currentURL = page.url();
      const ordersURL = currentURL.replace('AdminHelpOverview', 'AdminOrders');
      await page.goto(ordersURL);

      await page.waitFor('.siteContent');

      await page.screenshot({path: '/Users/nlyons/Documents/Web-Dev/puppeteer/screenshots/shot.jpg', type: 'jpeg'});

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

        upsertOrder({
          client: order.client,
          id: order.id,
          orderStatus: order.orderStatus,
          itemStatus: order.itemStatus,
          user: order.user,
          time: order.time,
          date: order.date
        });

      });

      fs.writeFile(`json/${client}-orders.json`, JSON.stringify(orders), function(err) {
        if (err) throw err;
        console.log("Saved!");
      });

  }

  await browser.close();

})();
