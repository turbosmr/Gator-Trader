/* This file handles "/sell" route */

const express = require('express');
const router = express.Router();
const { ensureRegisteredUserAuthenticated } = require('../controllers/userAuthenticated');
const sellController = require('../controllers/sellController');
const salesItemImageUpload = require('../middlewares/salesItemImageUpload');

// GET sell page
router.get('/', sellController.sell_get);

// POST request for sell page
router.post('/', ensureRegisteredUserAuthenticated, salesItemImageUpload.single('imageFileName'), sellController.sell_post);

module.exports = router;