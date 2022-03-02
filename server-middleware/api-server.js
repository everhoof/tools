const bodyParser = require('body-parser');
const express = require('express');
const preview = require('../api/preview');

const app = express();

app.use(bodyParser.json());
app.post('/preview/generate', preview.generate);

module.exports = {
  path: '/api',
  handler: app,
};
