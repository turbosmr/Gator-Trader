/* This file handles "/" route */

const express = require('express');
const router = express.Router();
const categories = require('../controllers/categoriesController');

// GET home page
router.get('/', (req, res) => {
    res.render('home');
});

router.get('/sell', (req, res) => {
    res.render('sell');
});

router.get('/error', (req, res) => {
    res.render('error');
});

module.exports = router;