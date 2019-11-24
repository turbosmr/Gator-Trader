const db = require('../config/db');

// Handle showing message page for a specific inquiry on GET
exports.get = (req, res, next) => {
    res.render('testMessage');
}

// Handle sending message on POST
exports.post = (req, res, next) => {
    console.log(req.body.message);
    res.render('testMessage');
}