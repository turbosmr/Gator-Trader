/* This file handles "/sell" route */

const express = require('express');
const router = express.Router();
const sellController = require('../controllers/sellController');
const { ensureRegisteredUserAuthenticated } = require('../controllers/userAuthenticated');

// GET sell page
router.get('/', sellController.sell_get);

// POST request for sell page
router.post('/', ensureRegisteredUserAuthenticated, sellController.sell_post);

module.exports = router;