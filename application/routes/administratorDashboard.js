/* This file handles "/dashboard" route */

const express = require('express');
const router = express.Router();
const dashboard = require('../controllers/administratorDashboardController');

// GET admin's dashboard page
router.get('/', dashboard.index);

module.exports = router;