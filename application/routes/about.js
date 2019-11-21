/* This file handles "/about" route */

const express = require('express');
const router = express.Router();

// GET about team page
router.get('/', (req, res) => {
    res.render('about/about');
});

// GET Steve's about page
router.get('/steve', (req, res) => {
    res.render('about/steve');
});

// GET Johnson's about page
router.get('/johnson', (req, res) => {
    res.render('about/johnson');
});

// GET Sergei's about page
router.get('/sergei', (req, res) => {
    res.render('about/sergei');
});

// GET Tevis' about page
router.get('/tevis', (req, res) => {
    res.render('about/tevis');
});

// GET Matthew's about page
router.get('/matthew', (req, res) => {
    res.render('about/matthew');
});

// GET Tim's about page
router.get('/tim', (req, res) => {
    res.render('about/tim');
});

// GET Osbaldo's about page
router.get('/osbaldo', (req, res) => {
    res.render('about/osbaldo');
});

module.exports = router;