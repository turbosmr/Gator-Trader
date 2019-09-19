/* This file handles "/about" routes */

const express = require('express');
const router = express.Router();

// about home page
router.get('/', function (req, res) {
    res.render('about');
});

// steve's page
router.get('/steve', function (req, res) {
    res.render('steve');
});

// johnson's page
router.get('/johnson', function (req, res) {
    res.render('johnson');
});

// sergei's page
router.get('/sergei', function (req, res) {
    res.render('sergei');
});

// tevis' page
router.get('/tevis', function (req, res) {
    res.render('tevis');
});

// matthew's page
router.get('/matthew', function (req, res) {
    res.render('matthew');
});

// tim's page
router.get('/tim', function (req, res) {
    res.render('tim');
});

// osbaldo's page
router.get('/osbaldo', function (req, res) {
    res.render('osbaldo');
});

module.exports = router;