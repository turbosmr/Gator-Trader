/* This file handles "/search" route */

const express = require('express');
const router = express.Router();
const db = require('../config/db');

const pageLimit = 10;

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

let pages = (req, res, next) => {
    let currentPage = parseInt(req.query.page) || 1;
    let keyword = req.query.k;
    let category = req.query.c;
    let sql = "";
    let placeholders = [];

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

    res.locals.sql = sql;
    res.locals.placeholders = placeholders;

    db.query(sql, placeholders, (error, result) => {
        if (error) throw (error);

        res.locals.currentPage = currentPage;
        res.locals.totalPages = Math.ceil(parseInt(result.length) / pageLimit);
        res.locals.totalProducts = result.length;

        next();
    });
}

router.get('/', pages, (req, res) => {
    let keyword = req.query.k;
    let category = req.query.c;
    let product = [];

    if (res.locals.currentPage > res.locals.totalPages || res.locals.currentPage < 1)
        return res.redirect('/');

    let limit = pageLimit;
    let offset = (pageLimit * res.locals.currentPage) - pageLimit;

    if (offset < 0) {
        limit += offset;
        offset = 0;
    }
    
    res.locals.sql += " LIMIT ? OFFSET ?";
    res.locals.placeholders.push(limit, offset);

    db.query(res.locals.sql, res.locals.placeholders, (error, result) => {
        if (error) throw error;

        for (let i = 0; i < result.length; i++) {
            product.push(result[i]);
        }

        res.render('results', {
            selectedCategory: category,
            keyword: keyword,
            product: product,
            offset: offset,
            pageLimit: limit,
            totalProducts: res.locals.totalProducts,
            pageCount: res.locals.totalPages,
            currentPage: res.locals.currentPage
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

router.get('/filter/price/:keyword', (req, res) => {
    let price = req.params.keyword;
    let keyword = req.query.searchKeyword;
    let min;
    let max;
    let product = [];

    if (price == "under25") {
        //handle logic to filter product results
        min = -0.01;
        max = 25.00;
    } else if (price == "25to50") {
        min = 24.99;
        max = 50.00;
    } else if (price == "50to200") {
        min = 49.99;
        max = 200.00;
    } else if (price == "over200") {
        min = 199.99;
        max = 10000000000.00;
    }
    let sql = "SELECT * FROM SalesItem WHERE (name LIKE ? OR description LIKE ?) AND (price > ?) AND (price < ?)";
    db.query(sql, ['%' + keyword + '%', '%' + keyword + '%', min, max], (error, result) => {
        if (error) throw error;
        for (let i = 0; i < result.length; i++) {
            product.push(result[i]);
        }
        res.render('results', {
            keyword: keyword,
            product: product,
            filter: price
        });
    });
});

module.exports = router;