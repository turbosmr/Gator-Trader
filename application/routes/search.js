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
    let priceFilter = req.query.pf;
    let min, max = 0;
    let product = [];
    let sql = "SELECT * FROM SalesItem";
    let placeholders = [];

    if (priceFilter == "under25") {
        min = -0.01;
        max = 25.00;
    }
    else if (priceFilter == "25to50") {
        min = 24.99;
        max = 50.00;
    }
    else if (priceFilter == "50to200") {
        min = 49.99;
        max = 200.00;
    }
    else if (priceFilter == "over200") {
        min = 199.99;
        max = 99999.99;
    }

    if (keyword) {
        if (category && category != 'all') {
            sql += " WHERE (name LIKE ? OR description LIKE ?) AND category = ?";
            placeholders = ['%' + keyword + '%', '%' + keyword + '%', category];
            if (priceFilter) {
                sql += " AND (price > ?) AND (price < ?)";
                placeholders = ['%' + keyword + '%', '%' + keyword + '%', category, min, max];
            }
        }
        else {
            sql += " WHERE (name LIKE ? OR description LIKE ?)";
            placeholders = ['%' + keyword + '%', '%' + keyword + '%'];
            if (priceFilter) {
                sql += " AND (price > ?) AND (price < ?)";
                placeholders = ['%' + keyword + '%', '%' + keyword + '%', min, max];
            }
        }
    }
    else if (category && category != 'all') {
        sql += " WHERE category = ?";
        placeholders = [category];
        if (priceFilter) {
            sql += " AND (price > ?) AND (price < ?)";
            placeholders = [category, min, max];
        }
    }
    else {
        if (priceFilter) {
            sql += " WHERE (price > ?) AND (price < ?)";
            placeholders = [min, max];
        }
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