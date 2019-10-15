/* This file handles "/" routes */

const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
    res.render('home', {
    loggedInUser: req.user});
});

module.exports = router;