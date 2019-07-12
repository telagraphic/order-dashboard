const puppeteer = require('puppeteer');
const accounts = require('./account.js');
const sites = require('./sites.js');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport : {
      width: 1000,
      height: 1500
    }
  });
  // await page.setViewport({width: 1000, height: 1000});
  const page = await browser.newPage();
  await page.goto('https://pflex.aldine.com/amster/AdminLogin.aspx');
  // await page.screenshot({path: 'pf-eq.png'});


  // Login Page
  const adminUserName = 'input[name="Username"]';
  const password = 'input[name="Password"]';
  const loginButton = 'input[type="submit"]';

  await page.click(adminUserName);
  await page.keyboard.type(accounts.ADMIN.username);

  await page.click(password);
  await page.keyboard.type(accounts.ADMIN.password);

  await page.click(loginButton);

  await page.waitForNavigation();

  // AdminHelpOverview.aspx

  const adminAccountsLink = 'a[href="AdminUserAccounts.aspx?g=Admin"]';
  await page.click(adminAccountsLink);

  // await page.waitForNavigation();

  // AdminUserAccounts.aspx
  await page.waitFor(3000);

  // const adminNav = '#AdminMaster_ContentPlaceHolderBody_buttonBar_actionButtons';
  // console.log(adminNav);
  const addNewAdmin = 'div#AdminMaster_ContentPlaceHolderBody_buttonBar_btnAddNew_spnActive';
  await page.click(addNewAdmin);


  // AdminUserDetail.aspx?userid=0&g=Admin&back=108
  await page.waitForNavigation();

  const loginName = 'input[name="AdminMaster$ContentPlaceHolderBody$txtLogonName"]';
  const adminPassword = 'input[id="AdminMaster_ContentPlaceHolderBody_txtPassword1"]'
  const confirmAdminPassword = 'input[id="AdminMaster_ContentPlaceHolderBody_txtPassword2"]';
  const adminFirstName = 'input[id="FIELD_6"]';
  const adminEmail = 'input[id="FIELD_40"]';
  const adminStreetAddress = 'input[id="FIELD_10"]';
  const adminCity = 'input[id="FIELD_14"]';
  const adminState = 'input[id="FIELD_17"]';
  const adminPostalCode = 'input[id="FIELD_19"]';
  const adminCountry = 'select#FIELD_20';
  const billingCountry = 'select#FIELD_252';
  const addAdminUser = 'input[id="AdminMaster_ContentPlaceHolderBody_btnAdd2"]';
  const cancelAdminUser = 'input[id="AdminMaster_ContentPlaceHolderBody_btnCancel2"]';

  await page.type(loginName, accounts.JESSICA.loginName);
  await page.type(adminPassword, accounts.JESSICA.password);
  await page.type(confirmAdminPassword, accounts.JESSICA.password);
  await page.type(adminFirstName, accounts.JESSICA.firstName);
  await page.type(adminEmail, accounts.JESSICA.email);
  await page.select(adminCountry, accounts.JESSICA.country);
  if (billingCountry) {
    await page.select(billingCountry, accounts.JESSICA.country);
  }


  await page.click(addAdminUser);

  // await page.waitFor(3000);

  await page.waitForNavigation();

  // await browser.close();
})();
