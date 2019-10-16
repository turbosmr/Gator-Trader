const express = require('express');
const router = express.Router();
const salesItem = require('../public/js/database_access/sales_item.js');
const db = require('../public/js/auth/db_config.js');

router.get('/', (req, res) => {
    res.render('search');
});


router.get('/result', (req, res) => {
    salesItem.percentLikeResults(req.query.key, function (err, rows) {
        if (err) throw err;
        var data = [];
        for (let i = 0; i < rows.length; i++) {
            data.push(rows[i].productName);
            console.log(JSON.stringify(rows[i]));
        }
        res.send(JSON.stringify(data));
    });
});

router.get('/all', (req, res) => {
    let sql = "SELECT * FROM SalesItems";
    var item = [];
    db.query(sql, (err, result) => {
        if (err){
            callback(err,null)
        }
        for (let i = 0; i < result.length; i++) {
            item.push(result[i].productName)
        }
        res.render('result', {items: item})
    });
});

module.exports = router;