const express = require('express');
const router = express.Router();
const adminRt = require('./adminRoutes');
const authRt = require('./authRoutes');

router.use(authRt);
router.use(adminRt);

module.exports = router;