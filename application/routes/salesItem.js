/* This file handles "/products" route */

const express = require('express');
const router = express.Router();
const salesItemController = require('../controllers/salesItemController');
const { ensureRegisteredUserAuthenticated } = require('../controllers/userAuthenticated');
const path = require('path');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

var upload = multer({ storage: storage })

// GET sales item page
router.get('/:pid', salesItemController.salesItem_get);

// GET request to edit sales item
router.get('/:pid/edit', ensureRegisteredUserAuthenticated, salesItemController.edit_get);

// POST request to edit sales item
router.post('/:pid/edit', ensureRegisteredUserAuthenticated, upload.single('imageFileName'), salesItemController.edit_post);

// GET request to end sales item
router.get('/:pid/end', ensureRegisteredUserAuthenticated, salesItemController.end);

// GET request to relist sales item
router.get('/:pid/relist', ensureRegisteredUserAuthenticated, salesItemController.relist);

module.exports = router;