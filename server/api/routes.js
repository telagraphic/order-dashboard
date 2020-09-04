const express = require('express');
const router = express.Router();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('../database/database');

const skyportalService = require('../services/skyportalService');
const pageflexService = require('../services/pageflexService');
const visionService = require('../services/visionService');
const pendingService = require('../services/pendingService');
const jobsService = require('../services/jobsService');

const Agenda = require('agenda');
const Agendash = require('agendash');
const agenda = new Agenda({ db: {address: mongoose.connectionString, collection: 'jobs'}});

router.get('/', async (req, res) => {
  const visionOrders = await visionService.findOrders();
  const jobLastRun = await jobsService.findJob('Vision Jobs');
  res.render('vision', { visionOrders: visionOrders, jobLastRun:  jobLastRun });
});

router.get('/skyportal', async (req, res) => {
  const skyportalOrders = await skyportalService.findOrders();
  const jobLastRun = await jobsService.findJob('Skyportal Jobs');
  res.render('skyportal', { skyportalOrders: skyportalOrders, jobLastRun:  jobLastRun});
});

router.get('/pageflex', async (req, res) => {
  const pageflexOrders = await pageflexService.findOrders();
  const jobLastRun = await jobsService.findJob('Pageflex Jobs');
  res.render('pageflex', { pageflexOrders: pageflexOrders, jobLastRun:  jobLastRun });
});

router.get('/pageflex-sites', async (req, res) => {
  res.render('pageflex-sites');
});

router.use('/orders', async (req, res) => {

  try {
    const skyportalOrders = await skyportalService.findOrders();
    const pageflexOrders = await pageflexService.findOrders();
    const visionOrders = await visionService.findOrders();

    res
      .status(200)
      .json({
        skyportal: skyportalOrders,
        pageflex: pageflexOrders,
        vision: visionOrders
      })

  } catch (error) {
    console.log(error);

    res
      .status(200)
      .json({
        error: error
      })
  }
});

router.get('/pending', async (req, res) => {
  const findPendingSkyportalOrders = await pendingService.findPendingOrders();
  const jobLastRun = await jobsService.findJob('Pageflex Jobs');
  res.render('pending', {pendingOrders: findPendingSkyportalOrders, jobLastRun:  jobLastRun})
});

router.use('/dash', Agendash(agenda));

module.exports = router;
