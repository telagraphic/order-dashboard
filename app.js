const express = require('express');
const app = express();
const router = require('./server/api/routes')
const mongoose = require('mongoose');
const path = require('path');
const exphbs = require('express-handlebars');

const skyportalService = require('./server/services/skyportalService');
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


app.use('/', router);

app.get('/', async (req, res) => {
  const visionOrders = await visionService.findOrders();
  res.render('vision', { visionOrders: visionOrders } );
});

app.get('/skyportal', async (req, res) => {
  const skyportalOrders = await skyportalService.findOrders();
  res.render('skyportal', { skyportalOrders: skyportalOrders });
});

app.get('/pageflex', async (req, res) => {
  const pageflexOrders = await pageflexService.findOrders();
  res.render('pageflex', { pageflexOrders: pageflexOrders });
});

app.listen(3000, () => console.log('GSB Order Dashboard is running'));
