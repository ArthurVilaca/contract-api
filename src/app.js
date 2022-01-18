const express = require('express');
const bodyParser = require('body-parser');
const {
    sequelize
} = require('./model')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

const handlers = require('./handler');
app.use('/', handlers);

module.exports = app;