/* This file handles "/search" route */

const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/', (req, res) => {
    let keyword = req.body.keyword;
    let category = req.body.categories;

    if (keyword) {
        if (category) {
            res.redirect('/search?k=' + keyword + '&c=' + category);
        }
        else {
            res.redirect('/search?k=' + keyword);
        }
    }
    else if (category) {
        res.redirect('/search?c=' + category);
    }
});

router.get('/', (req, res) => {
    let keyword = req.query.k;
    let category = req.query.c;
    let product = [];
    let sql = "";
    let placeholders = [];
    console.log(req.query)

    if (keyword) {
        if (category && category != 'all') {
            sql = "SELECT * FROM SalesItem WHERE (name LIKE ? OR description LIKE ?) AND category = ?";
            placeholders = ['%' + keyword + '%', '%' + keyword + '%', category];
        }
        else {
            sql = "SELECT * FROM SalesItem WHERE name LIKE ? OR description LIKE ?";
            placeholders = ['%' + keyword + '%', '%' + keyword + '%'];
        }
    }
    else if (category && category != 'all') {
        sql = "SELECT * FROM SalesItem WHERE category = ?";
        placeholders = [category];
    }
    else {
        sql = "SELECT * FROM SalesItem";
    }

    db.query(sql, placeholders, (error, result) => {
        if (error) throw error;
        for (let i = 0; i < result.length; i++) {
            product.push(result[i]);
        }
        res.render('results', {
            keyword: keyword,
            selectedCategory: category,
            product: product
        });
    });
});

router.get('/suggestions/typeahead', (req, res) => {
    let sql = "SELECT * FROM SalesItem WHERE name LIKE ? OR description LIKE ?";
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