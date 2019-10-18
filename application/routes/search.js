const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
    res.redirect('/');
});

router.get('/:keyword', (req, res) => {
    let sql = "SELECT * FROM SalesItems WHERE productName LIKE ? OR description LIKE ?";
    let keyword = req.params.keyword;
    let product = [];

    db.query(sql, ['%' + keyword + '%', '%' + keyword + '%'], (error, result) => {
        if (error) throw error;
        for (let i = 0; i < result.length; i++) {
            product.push(result[i]);
        }
        res.render('result', { product: product });
    });
});

router.post('/', (req, res) => {
    let keyword = req.body.keyword;

    if (keyword !== '') {
        res.redirect('/search/' + keyword);
    }
    else {
        res.redirect('/');
    }
});

router.get('/result/typeahead', (req, res) => {
    let sql = "SELECT * FROM SalesItems WHERE productName LIKE ? OR description LIKE ?";
    let keyword = req.query.key;
    let product = [];

    db.query(sql, ['%' + keyword + '%', '%' + keyword + '%'], (error, result) => {
        if (error) throw error;
        for (let i = 0; i < result.length; i++) {
            product.push(result[i].productName);
        }
        res.send(JSON.stringify(product));
    });
});

router.get('/all', (req, res) => {
    let sql = "SELECT * FROM SalesItems";
    let product = [];

    db.query(sql, (error, result) => {
        if (error) throw error;
        for (let i = 0; i < result.length; i++) {
            product.push(result[i]);
        }
        res.render('result', { product: product });
    });

});

module.exports = router;