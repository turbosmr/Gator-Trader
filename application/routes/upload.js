/* This file handles "/upload" route */

const express = require('express');
const router = express.Router();
const multer = require('multer');

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

var upload = multer({ storage: storage })

// Render home page
router.get('/', (req, res) => {
    res.render('upload');
});

module.exports = router;