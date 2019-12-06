/* This file handles "/sell" route */

const express = require('express');
const router = express.Router();
const { ensureStudentAuthenticated } = require('../controllers/userAuthenticated');
const sellController = require('../controllers/sellController');
const salesItemImageUpload = require('../middlewares/salesItemImageUpload');
const salesItemImageCompression = require('../middlewares/salesItemImageCompression')

// GET sell page
router.get('/', sellController.sell_get);

// POST request for sell page
router.post('/', ensureStudentAuthenticated, salesItemImageUpload.array('salesItemImage', 4), salesItemImageCompression, sellController.sell_post);

module.exports = router;