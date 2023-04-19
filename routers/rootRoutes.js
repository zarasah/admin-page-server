const express = require('express');
const rootRt = express.Router();
const rootCtrl = require('../controllers').rootCtrl;

rootRt.get('/', rootCtrl.getAllProducts);

module.exports = rootRt;