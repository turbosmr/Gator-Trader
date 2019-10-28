/* This file handles "/" route */

const express = require('express');
const router = express.Router();

// Render home page
router.get('/', (req, res) => {
    res.render('home');
});

router.get('/sell', (req, res) => {
    res.render('sell');
});

router.get('/item', (req, res) => {
    res.render('item');
});

module.exports = router;