const express = require('express');
const app = express();
const router = require('./server/api/routes')
const path = require('path');
const dayjs = require('dayjs');
const exphbs = require('express-handlebars');


app.use(express.static(__dirname + '/public'));

const hbs = exphbs.create({
  partialsDir: ["public/views/partials"],
  extname: ".hbs",
  layoutsDir: path.join(__dirname, "public/views/layouts"),
  defaultLayout: path.join(__dirname, "public/views/layouts/main"),
  helpers: {
    formatDate: function(date) {
      return dayjs(date).format('MM/DD/YYYY')
      //return dayjs(date).format('MM/DD/YYYY [@]h:mmA')
    },
    formatNumber: function(number) {
      return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    },
    checkStatus: function(status) {

      // pageflex: failed, not approved, new order, shipped
      // skyportal: cancelled, not approved, press, completed
      // vision: overdue, wip, ready for pickup

      if (status === 'In Process') {
        return `<svg class="header__status-key-icon" id="" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="0.25in" height="0.25in" viewBox="0 0 12 12">
                  <title>status-circle</title>
                  <circle cx="6" cy="6" r="6" style="fill: #98c379"/>
                </svg>
                <span class="header__status-key-description" style="color:#98c379">In Process</span>`;
      } else if (status === 'Canceled') {
        return `<svg class="header__status-key-icon" id="" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="0.25in" height="0.25in" viewBox="0 0 12 12">
                  <title>status-circle</title>
                  <circle cx="6" cy="6" r="6" style="fill: #e06c75"/>
                </svg>
                <span class="header__status-key-description" style="color:#e06c75">Canceled</span>`;
      } else if (status === 'Rejected') {
       return `<svg class="header__status-key-icon" id="" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="0.25in" height="0.25in" viewBox="0 0 12 12">
                 <title>status-circle</title>
                 <circle cx="6" cy="6" r="6" style="fill: #e06c75"/>
               </svg>
               <span class="header__status-key-description" style="color:#e06c75">Rejected</span>`;
      } else if (status === 'Declined') {
       return `<svg class="header__status-key-icon" id="" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="0.25in" height="0.25in" viewBox="0 0 12 12">
                 <title>status-circle</title>
                 <circle cx="6" cy="6" r="6" style="fill: #e06c75"/>
               </svg>
               <span class="header__status-key-description" style="color:#e06c75">Declined</span>`;
      } else if (status === 'Completed') {
       return `<svg class="header__status-key-icon" id="" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="0.25in" height="0.25in" viewBox="0 0 12 12">
                 <title>status-circle</title>
                 <circle cx="6" cy="6" r="6" style="fill: #FFFFFF"/>
               </svg>
               <span class="header__status-key-description" style="color:#FFFFFF">Completed</span>`;
      } else if (status === 'Pending Review') {
       return `<svg class="header__status-key-icon" id="" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="0.25in" height="0.25in" viewBox="0 0 12 12">
                 <title>status-circle</title>
                 <circle cx="6" cy="6" r="6" style="fill: #FFFA72"/>
               </svg>
               <span class="header__status-key-description" style="color:#FFFA72">Pending Review</span>`;
      } else if (status === 'Not Approved') {
        return `<svg class="header__status-key-icon" id="" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="0.25in" height="0.25in" viewBox="0 0 12 12">
                  <title>status-circle</title>
                  <circle cx="6" cy="6" r="6" style="fill: #FFFA72"/>
                </svg>`;
      } else if (status === 'Order Received') {
        return `<svg class="header__status-key-icon" id="" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="0.25in" height="0.25in" viewBox="0 0 12 12">
                  <title>status-circle</title>
                  <circle cx="6" cy="6" r="6" style="fill: #E89042"/>
                </svg>
                <span class="header__status-key-description" style="color:#E89042">Order Received</span>`;
      } else if (status === 'Press') {
        return `<svg class="header__status-key-icon" id="" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="0.25in" height="0.25in" viewBox="0 0 12 12">
                  <title>status-circle</title>
                  <circle cx="6" cy="6" r="6" style="fill: #98c379"/>
                </svg>
                <span class="header__status-key-description" style="color:#98c379">Press</span>`;
      } else if (status === 'Order Completed' || status === 'Order Complete') {
        return `<span class="header__status-key-description" style="color:#FFFFFF">Order Complete</span>`;
      } else if (status === 'Order Cancelled') {
        return `<svg class="header__status-key-icon" id="" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="0.25in" height="0.25in" viewBox="0 0 12 12">
                  <title>status-circle</title>
                  <circle cx="6" cy="6" r="6" style="fill: #e06c75"/>
                </svg>
                <span class="header__status-key-description" style="color:#e06c75">Order Cancelled</span>`;
      } else if (status === 'Failed') {
        return `<svg class="header__status-key-icon" id="" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="0.25in" height="0.25in" viewBox="0 0 12 12">
                  <title>status-circle</title>
                  <circle cx="6" cy="6" r="6" style="fill: #e06c75"/>
                </svg>
                <span class="header__status-key-description" style="color:#e06c75">Failed</span>`
      }
    }
  }
});




app.set("view engine", "hbs");
app.set('views', path.join(__dirname, "/public/views/pages"));
app.engine( "hbs", hbs.engine);

app.use('/', router);

app.listen(3000, () => console.log('GSB Order Dashboard is running'));
