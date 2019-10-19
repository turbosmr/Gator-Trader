/* This file handles "/" route */

const express = require('express');
const router = express.Router();

// Render home page
router.get('/', (req, res) => {
    res.render('home', {
        loggedInUser: req.user
    });
});

module.exports = router;