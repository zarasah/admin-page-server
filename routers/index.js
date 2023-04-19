const express = require('express');
const router = express.Router();
const rootRt = require('./rootRoutes');
const adminRt = require('./adminRoutes');
const authRt = require('./authRoutes');

router.use(rootRt);
router.use(authRt);
router.use('/admin', adminRt);

module.exports = router;