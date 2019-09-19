/* This file handles "/" routes */

const express = require('express');
const router = express.Router();

// Home page
router.get('/', function (req, res) {
    res.send('SFSU<br>CSC 648<br>Software Engineering<br>Fall 2019<br>Section 01<br>Team 03<br><br>Coming soon...');
});

module.exports = router;