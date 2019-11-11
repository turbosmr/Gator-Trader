const db = require('../config/db');

// Handle showing sell page on GET
exports.sell_get = (req, res, next) => {
    res.render('sell');
}

// Handle submitting sales item for sell on POST
exports.sell_post = (req, res, next) => {
    //console.log(req.body);
    res.render('sell');
}