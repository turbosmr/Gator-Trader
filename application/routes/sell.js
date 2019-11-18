/* This file handles "/sell" route */

const express = require('express');
const router = express.Router();
const sellController = require('../controllers/sellController');
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

// GET sell page
router.get('/', sellController.sell_get);

// POST request for sell page
router.post('/', ensureRegisteredUserAuthenticated, upload.single('imageFileName'), sellController.sell_post);

module.exports = router;