const express = require('express');
const router = express.Router();
const adminRt = require('./adminRoutes');

router.use(adminRt);

module.exports = router;