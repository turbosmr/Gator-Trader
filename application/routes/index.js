/* This file handles "/" routes */

const express = require('express');
const router = express.Router();

// Home page
router.get('/', function (req, res) {
    res.render('home');
});

router.get('/account', function(req, res) {
    res.render('account');
});

router.get('/results', function(req, res) {
    res.render('results');
});

module.exports = router;