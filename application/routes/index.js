/* This file handles "/" routes */

const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
    res.render('home', {
    loggedInUser: req.user});
});

router.get('/account', function(req, res) {
    res.render('account');
});

router.get('/results', function(req, res) {
    res.render('results');
});

router.get('/sell', function(req, res) {
    res.render('sell');
});

module.exports = router;