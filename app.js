const express = require('express');
const app = express();
const router = require('./server/api/routes')
const mongoose = require('mongoose');
const path = require('path');
const exphbs = require('express-handlebars');

const presseroService = require('./server/services/presseroService');
const pageflexService = require('./server/services/pageflexService');
const visionService = require('./server/services/visionService');


app.use(express.static(__dirname + '/public'));

const hbs = exphbs.create({
  partialsDir: ["public/views/partials"],
  extname: ".hbs",
  layoutsDir: path.join(__dirname, "public/views/layouts"),
  defaultLayout: path.join(__dirname, "public/views/layouts/main"),
  helpers: {
    formatDate: function(date) {
      return dayjs(date).format('MM/DD/YYYY [@]h:mmA')
    },
    formatNumber: function(number) {
      return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
  }
});

app.set("view engine", "hbs");
app.set('views', path.join(__dirname, "/public/views/pages"));
app.engine( "hbs", hbs.engine);

// app.get('/', function(req, res) {
//   res.render('vision');
// });

app.get('/', async (req, res) => {
  const visionOrders = await visionService.findOrders();
  // console.log(visionOrders);
  res.render('vision', { visionOrders: visionOrders } );
  // res.send(visionOrders);
});

app.get('/skyportal', function(req, res) {
  res.render('skyportal');
});

app.get('/pageflex', function(req, res) {
  res.render('pageflex');
});

app.listen(3000, () => console.log('GSB Order Dashboard is running'));
