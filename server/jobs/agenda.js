const mongoose = require("../database/database");
let Agenda = require("agenda");


// set the collection where the jobs will be save
// the collection can be name anything
let agenda = new Agenda({ db: {address: 'mongodb://127.0.0.1:27017/gsb-order-dashboard', collection: 'jobs'}});

agenda.define('get pressero jobs', async job => {
  console.log("running pressero job");
});

(async function() { // IIFE to give access to async/await
  await agenda.start();
  await agenda.every('10 seconds', 'get pressero jobs');
})();

// module.exports = agenda;
