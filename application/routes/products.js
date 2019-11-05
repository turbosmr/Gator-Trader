/* This file handles "/products" route */

const express = require('express');
const router = express.Router();

// GET product page
router.get('/:pid', (req, res) => {
    res.render('item');
});

// GET request to update sales item

// POST request to update sales item

// GET request to delete sales item

// GET request to approve or disapprove sales item (Administrator)

module.exports = router;