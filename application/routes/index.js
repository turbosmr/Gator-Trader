/* This file handles "/" route */

const express = require('express');
const router = express.Router();

// GET home page
router.get('/', (req, res) => {
    res.render('home');
});

router.get('/sell', (req, res) => {
    res.render('sell');
});

module.exports = router;