const express = require('express');
const router = express.Router();
const db = require('../public/js/auth/db_config.js');

router.get('/', (req, res) => {
    res.render('search');
});

router.post('/', (req, res) => {
    let sql = "SELECT * FROM SalesItems WHERE productName LIKE ? OR description LIKE ?";
    let term = req.body.typeahead;
    db.query(sql,['%'+term +'%','%'+ term +'%'], (err, result) => {
        if (err) throw err;
        var data = [];
        for (let i = 0; i < result.length; i++) {
            data.push(result[i]);
        }
        res.render('result', {items: data});
    });
    //console.log(req.body.typeahead);
});


router.get('/result', (req, res) => {
    let sql = "SELECT * FROM SalesItems WHERE productName LIKE ? OR description LIKE ?";
    let term = req.query.key;
    db.query(sql,['%'+term +'%','%'+ term +'%'], (err, result) => {
        if (err) throw err;
        var data = [];
        for (let i = 0; i < result.length; i++) {
            data.push(result[i].productName);
        }
        res.send(JSON.stringify(data));
    });
});

router.get('/all', (req, res) => {
    var item = [];
    let sql = "SELECT * FROM SalesItems";
    db.query(sql, (err, result) => {
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            item.push(result[i]);
        }
        res.render('result', {items: item});
    });
    
});

module.exports = router;