/* This file handles "/products" route */

const express = require('express');
const router = express.Router();
const { ensureStudentAuthenticated } = require('../controllers/userAuthenticated');
const salesItemController = require('../controllers/salesItemController');
const salesItemImageUpload = require('../middlewares/salesItemImageUpload');
const salesItemImageCompression = require('../middlewares/salesItemImageCompression')
const inquiryController = require('../controllers/inquiryController');

// GET sales item page
router.get('/:pid', salesItemController.salesItem_get);

// GET request to edit sales item
router.get('/:pid/edit', ensureStudentAuthenticated, salesItemController.edit_get);

// POST request to edit sales item
router.post('/:pid/edit', ensureStudentAuthenticated, salesItemImageUpload.array('salesItemImage', 4), salesItemImageCompression, salesItemController.edit_post);

// GET request to end listing of sales item
router.get('/:pid/end', ensureStudentAuthenticated, salesItemController.end);

// GET request to relist sales item
router.get('/:pid/relist', ensureStudentAuthenticated, salesItemController.relist);

// GET contact seller page 
router.get('/:pid/inquiry', ensureStudentAuthenticated, inquiryController.get);

// POST request to send message in contact seller page
router.post('/:pid/inquiry', ensureStudentAuthenticated, inquiryController.post);

module.exports = router;