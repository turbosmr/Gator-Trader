/* This file handles "/products" route */

const express = require('express');
const router = express.Router();
const salesItemController = require('../controllers/salesItemController');

// GET sales item page
router.get('/:pid', salesItemController.salesItem_get);

// GET request to update sales item

// POST request to update sales item

// GET request to delete sales item

// GET request to approve or disapprove sales item (Administrator)

module.exports = router;