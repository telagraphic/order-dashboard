const mongoose = require("../database/database");
const visionJob = require("./visionJob");
const skyportalJob = require("./skyportalJob");
const pageflexJob = require("./pageflexJob");
const Agenda = require("agenda");


async function start() {

  console.log("starting agenda jobs");

  let agenda = new Agenda(
    { db: {address: mongoose.connectionString, collection: 'jobs'}}
  );

  agenda.define('Vision Jobs', (job, done) => {
    visionJob.getOrders();
    done();
  });

  agenda.define('Skyportal Jobs', (job, done) => {
    skyportalJob.getOrders();
    done();
  });

  agenda.define('Pageflex Jobs', (job, done) => {
    pageflexJob.getOrders();
    done();
  });

  // await agenda.start();
  // await agenda.every('15 minutes', 'Vision Jobs');
  // await agenda.every('15 minutes', 'Skyportal Jobs');
  // await agenda.every('15 minutes', 'Pageflex Jobs');
}

module.exports = {
    start: start
};
