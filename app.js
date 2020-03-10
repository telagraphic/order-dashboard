const express = require('express');
const app = express();
const router = require('./server/api/routes')
const mongoose = require('mongoose');
const path = require('path')

app.use('/', express.static('public'))
app.use('/', router);

app.listen(3000, () => console.log('GSB Order Dashboard is running'));
