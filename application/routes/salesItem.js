/* This file handles "/products" route */

const express = require('express');
const router = express.Router();
const { ensureRegisteredUserAuthenticated } = require('../controllers/userAuthenticated');
const salesItemController = require('../controllers/salesItemController');
const salesItemImageUpload = require('../middlewares/salesItemImageUpload');

// GET sales item page
router.get('/:pid', salesItemController.salesItem_get);

// GET request to edit sales item
router.get('/:pid/edit', ensureRegisteredUserAuthenticated, salesItemController.edit_get);

// POST request to edit sales item
router.post('/:pid/edit', ensureRegisteredUserAuthenticated, salesItemImageUpload.array('salesItemImage', 4), salesItemController.edit_post);

// GET request to end listing of sales item
router.get('/:pid/end', ensureRegisteredUserAuthenticated, salesItemController.end);

// GET request to relist sales item
router.get('/:pid/relist', ensureRegisteredUserAuthenticated, salesItemController.relist);

// GET contact seller page 
router.get('/:pid/inquiry', ensureRegisteredUserAuthenticated, salesItemController.inquiry_get);

// POST request to send message in contact seller page
router.post('/:pid/inquiry', ensureRegisteredUserAuthenticated, salesItemController.inquiry_post);

module.exports = router;