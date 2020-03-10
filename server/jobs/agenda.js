const mongoose = require("../database/database");
const presseroJob = require("./presseroJob.js");
const Agenda = require("agenda");



// set the collection where the jobs will be save
// the collection can be name anything
let agenda = new Agenda({ db: {address: 'mongodb://127.0.0.1:27017/gsb-order-dashboard', collection: 'jobs'}});

agenda
  .processEvery('5 minutes')
  .maxConcurrency(10);

agenda.define('get pressero jobs', async job => {
  console.log("starting the job...");
  presseroJob.getOrders();
});

(async function() { // IIFE to give access to async/await
  await agenda.start();
  await agenda.every('10 seconds', 'get pressero jobs');
})();

// module.exports = agenda;
