require('dotenv').config();
const express = require('express');
const app = express();
const router = require('./server/api/routes')
const path = require('path');
const dayjs = require('dayjs');
const exphbs = require('express-handlebars');
const agenda = require('./server/jobs/agenda');

app.use(express.static(__dirname + '/public'));

const hbs = exphbs.create({
  partialsDir: ["public/views/partials"],
  extname: ".hbs",
  layoutsDir: path.join(__dirname, "public/views/layouts"),
  defaultLayout: path.join(__dirname, "public/views/layouts/main"),
  helpers: {
    formatDate: function(date) {
      return dayjs(date).format('MM/DD/YYYY')
    },
    formatNumber: function(number) {
      return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    },
    checkClass: function(status) {
      if (status === 'In Process' || status === 'Press') {
        return `orders__body-row-in-process`
      } else if (status === 'Canceled' || status === 'Declined' || status === 'Rejected' || status === 'Failed' || status === 'Order Cancelled') {
        return `orders__body-row-cancelled`
      } else if (status === 'Pending Review' || status === 'Not Approved') {
        return `orders__body-row-unapproved`
      } else if (status === 'Order Received' ) {
        return `orders__body-row-new-order`
      } else if (status === 'Order Completed' || status === 'Completed' || status === 'Order Complete') {
        return `orders__body-row-completed`
      }
    },
    checkStatus: function(status) {
      if (status === 'Order Cancelled') {
        return `<span class="header__status-key-description" style="color:#e06c75">Order Cancelled</span>`;
      } else if (status === 'Failed') {
        return `<span class="header__status-key-description" style="color:#e06c75">Failed</span>`
      } else if (status === 'Canceled') {
        return `<span class="header__status-key-description" style="color:#e06c75">Canceled</span>`;
      } else if (status === 'Rejected') {
        return `<span class="header__status-key-description" style="color:#e06c75">Rejected</span>`;
      } else if (status === 'Declined') {
        return `<span class="header__status-key-description" style="color:#e06c75">Declined</span>`;
      } else if (status === 'Pending Review') {
        return `<span class="header__status-key-description" style="color:#FFFA72">Pending Review</span>`;
      } else if (status === 'Not Approved') {
        return `<span class="header__status-key-description" style="color:#FFFA72">Not Approved</span>`;
      } else if (status === 'Order Received') {
        return `<span class="header__status-key-description" style="color:#E89042">Order Received</span>`;
      } else if (status === 'Press') {
        return `<span class="header__status-key-description" style="color:#98c379">Press</span>`;
      } else if (status === 'In Process') {
        return `<span class="header__status-key-description" style="color:#98c379">In Process</span>`;
      } else if (status === 'Order Completed' || status === 'Order Complete') {
        return `<span class="header__status-key-description" style="color:#FFFFFF">Order Complete</span>`;
      } else if (status === 'Completed') {
        return `<span class="header__status-key-description" style="color:#FFFFFF">Completed</span>`;
      }
    }
  }
});




app.set("view engine", "hbs");
app.set('views', path.join(__dirname, "/public/views/pages"));
app.engine( "hbs", hbs.engine);

app.use('/', router);
agenda.start();

app.listen(3000, () => console.log('GSB Order Dashboard is running'));
