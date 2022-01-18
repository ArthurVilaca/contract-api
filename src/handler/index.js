const express = require('express');
const {
    getProfile
} = require('../middleware/getProfile');
const router = express.Router();

const contractsHandler = require('./contracts');
const jobsHandler = require('./jobs');
const balancesHandler = require('./balances');
const adminHandler = require('./admin');

router.use('/contracts', getProfile, contractsHandler);
router.use('/jobs', getProfile, jobsHandler);
router.use('/balances', balancesHandler);
router.use('/admin', adminHandler);

module.exports = router;