/* This file handles "/products" route */

const express = require('express');
const router = express.Router();

// Render home page
router.get('/:pid', (req, res) => {
    res.render('item');
});

module.exports = router;