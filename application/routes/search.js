/* This file handles "/search" route */

const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
    let sql = "SELECT * FROM Product";
    let product = [];

    db.query(sql, (error, result) => {
        if (error) throw error;
        for (let i = 0; i < result.length; i++) {
            product.push(result[i]);
        }
        res.render('results', { 
            loggedInUser: req.user,
            product: product
        });
    });
});

router.get('/:keyword', (req, res) => {
    let sql = "SELECT * FROM Product WHERE name LIKE ? OR description LIKE ?";
    let keyword = req.params.keyword;
    let product = [];

    db.query(sql, ['%' + keyword + '%', '%' + keyword + '%'], (error, result) => {
        if (error) throw error;
        for (let i = 0; i < result.length; i++) {
            product.push(result[i]);
        }
        res.render('results', { 
            loggedInUser: req.user, 
            keyword: keyword,
            product: product
        });
    });
});

router.post('/', (req, res) => {
    let keyword = req.body.keyword;


    res.redirect('/search/' + keyword);
});

router.get('/suggestions/typeahead', (req, res) => {
    let sql = "SELECT * FROM Product WHERE name LIKE ? OR description LIKE ?";
    let keyword = req.query.key;
    let product = [];

    db.query(sql, ['%' + keyword + '%', '%' + keyword + '%'], (error, result) => {
        if (error) throw error;
        for (let i = 0; i < result.length; i++) {
            product.push(result[i].name);
        }
        res.send(JSON.stringify(product));
    });
});

module.exports = router;