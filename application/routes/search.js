/* This file handles "/search" route */

const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
    let sql = "SELECT * FROM SalesItem";
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
    let sql = "SELECT * FROM SalesItem WHERE name LIKE ? OR description LIKE ?";
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
    console.log(req.query);
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
    db.query(sql, ['%' + keyword + '%','%' + keyword + '%', min, max], (error, result) => {
        if (error) throw error;
        for (let i = 0; i < result.length; i++) {
            product.push(result[i]);
        }
        res.render('results', { 
            loggedInUser: req.user, 
            keyword: keyword,
            product: product,
            filter: price
        });
    });
});

module.exports = router;