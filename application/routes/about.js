/* This file handles "/about" routes */

const express = require('express');
const router = express.Router();

// about home page
router.get('/', function(req, res) {
    res.render('about/about');
});

// steve's page
router.get('/steve', function(req, res) {
    res.render('about/steve');
});

// johnson's page
router.get('/johnson', function(req, res) {
    res.render('about/johnson');
});

// sergei's page
router.get('/sergei', function(req, res) {
    res.render('about/sergei');
});

// tevis' page
router.get('/tevis', function(req, res) {
    res.render('about/tevis');
});

// matthew's page
router.get('/matthew', function(req, res) {
    res.render('about/matthew');
});

// tim's page
router.get('/tim', function(req, res) {
    res.render('about/tim');
});

// osbaldo's page
router.get('/osbaldo', function(req, res) {
    res.render('about/osbaldo');
});

module.exports = router;