/* This file handles "/about" routes */

const express = require('express');
const router = express.Router();

// about home page
router.get('/', (req, res) => {
    res.render('about/about');
});

// steve's page
router.get('/steve', (req, res) => {
    res.render('about/steve');
});

// johnson's page
router.get('/johnson', (req, res) => {
    res.render('about/johnson');
});

// sergei's page
router.get('/sergei', (req, res) => {
    res.render('about/sergei');
});

// tevis' page
router.get('/tevis', (req, res) => {
    res.render('about/tevis');
});

// matthew's page
router.get('/matthew', (req, res) => {
    res.render('about/matthew');
});

// tim's page
router.get('/tim', (req, res) => {
    res.render('about/tim');
});

// osbaldo's page
router.get('/osbaldo', (req, res) => {
    res.render('about/osbaldo');
});

module.exports = router;