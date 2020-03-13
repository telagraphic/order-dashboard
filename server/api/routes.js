const express = require('express');
const router = express.Router();
const presseroService = require('../services/presseroService');
const pageflexService = require('../services/pageflexService');
const visionService = require('../services/visionService');
const Agenda = require('agenda');
const Agendash = require('agendash');
const agenda = new Agenda({ db: {address: 'mongodb://127.0.0.1:27017/gsb-order-dashboard', collection: 'jobs'}});

router.use('/orders', async (req, res) => {

  try {
    const presseroOrders = await presseroService.findOrders();
    const pageflexOrders = await pageflexService.findOrders();
    const visionOrders = await visionService.findOrders();

    res
      .status(200)
      .json({
        pressero: presseroOrders,
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

//
// router.use('/pressero', async (req, res) => {
//
//   try {
//
//     new Promise((resolve, reject) => {
//       reject(new Error("Whoops!"));
//     });
//
//     res.send(presseroOrders);
//
//
//   } catch (error) {
//
//     console.log(error);
//
//     res
//       .status(200)
//       .json({
//         error: true,
//         error: error.message,
//         error: error.stack
//       })
//   }
//
//
// });
//
// router.use('/pageflex', async (req, res) => {
//   const pageflexOrders = await pageflexService.findOrders();
//   res.send(pageflexOrders);
// });
//
// router.use('/vision', async (req, res) => {
//   const visionOrders = await visionService.findOrders();
//   res.send(visionOrders);
// });

router.use('/dash', Agendash(agenda));


module.exports = router;
