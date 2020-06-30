const express = require('express');
const router = express.Router();
const path = require('path');
const exphbs = require('express-handlebars');

const skyportalService = require('../services/skyportalService');
const pageflexService = require('../services/pageflexService');
const visionService = require('../services/visionService');
const pendingService = require('../services/pendingService');
const Agenda = require('agenda');
const Agendash = require('agendash');
const agenda = new Agenda({ db: {address: 'mongodb://127.0.0.1:27017/gsb-order-dashboard', collection: 'jobs'}});


router.get('/', async (req, res) => {
  const visionOrders = await visionService.findOrders();
  res.render('vision', { visionOrders: visionOrders } );
});

router.get('/skyportal', async (req, res) => {
  const skyportalOrders = await skyportalService.findOrders();
  res.render('skyportal', { skyportalOrders: skyportalOrders });
});

router.get('/pageflex', async (req, res) => {
  const pageflexOrders = await pageflexService.findOrders();
  res.render('pageflex', { pageflexOrders: pageflexOrders });
});

router.use('/orders', async (req, res) => {

  try {
    const skyportalOrders = await skyportalService.findOrders();
    const pageflexOrders = await pageflexService.findOrders();
    const visionOrders = await visionService.findOrders();

    res
      .status(200)
      .json({
        pressero: skyportalOrders,
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
  res.render('pending', {pendingOrders: findPendingSkyportalOrders})
});

router.use('/dash', Agendash(agenda));

module.exports = router;
