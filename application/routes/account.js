/* This file handles "/account" route */

const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Render dashboard page
router.get('/dashboard', (req, res) => {
    if (!req.user) {
        res.render('dashboard');
    }
    else {
        let product = [];
        let sql = "SELECT SalesItem.name, SalesItem.status, Category.name AS category, SalesItem.price FROM SalesItem INNER JOIN Category ON SalesItem.category = Category.cid WHERE seller = ? AND status != 'unapproved'";
        placeholder = [req.user.sid];
        db.query(sql, placeholder, (err, result) => {
            console.log(result.length)
            for (let i = 0; i < result.length; i++) {
                 product.push(result[i]);
            }
            res.render('dashboard', { product: product });
        });
    }
});

module.exports = router;