const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Order = require("./models/order");
const hbs = require('hbs')
const hbsIntl = require('handlebars-intl');
const path = require('path')

const DB_URL = 'mongodb://127.0.0.1:27017/pageflex-orders';

if (mongoose.connection.readyState == 0) {
  mongoose.connect(DB_URL, { useNewUrlParser: true, useFindAndModify: false });
}

app.use('/', express.static('public'))

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, "views"))

hbsIntl.registerWith(hbs);
hbs.registerPartial('head', '{{head}}');



app.get('/orders', async (req, res) => {
    let today = new Date();
    let twoWeeksAgo = today.getDate() - 14;
    today.setDate(twoWeeksAgo)

    await Order.find({date: { $gte: today }}, function(error, orders) {
      res.render('orders', { orders: orders, error: error});
    });


    // try {
    //   res.status(300).json(orders);
    // } catch (err) {
    //   res.status(500).json(err);
    // }
});


app.get('/jobs', async (req, res) => {
    const orders = await Order.find({});

    try {
      res.status(300).json(orders);
    } catch (err) {
      res.status(500).json(err);
    }
});

app.listen(3000, () => console.log('GetSet is running'));
