const passport = require('passport');
const db = require('../config/db');

// Display administrator's login page on GET
exports.login_get = (req, res, next) => {
    res.render('adminLogin');
}

// Handle administrator login authentication via Passport API on POST
exports.login_post = (req, res, next) => {
    passport.authenticate('administrator-login', {
        successRedirect: '/admin/dashboard',
        failureRedirect: '/admin/login',
        failureFlash: true,
        badRequestMessage: 'Please fill in all fields'
    })(req, res, next);
}

// Handle administrator logout on GET
exports.logout = (req, res, next) => {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/');
}

// Display administrator's dashboard page on GET
// Contains list of approved and unapproved sales item
// Author @Osbaldo Martinez
exports.dashboard = (req, res, next) => {
    let approvedSalesItem = [];
    let unapprovedSalesItem = [];
    let sql = "SELECT * FROM SalesItem";

    db.query(sql, (err, result) => {
        if (err) throw err;

        for (let i = 0; i < result.length; i++) {
            if (result[i].status == "approved") {
                approvedSalesItem.push(result[i])
            } else {
                unapprovedSalesItem.push(result[i]);
            }
        }

        res.render('adminDashboard', {
            approvedSalesItem: approvedSalesItem,
            unapprovedSalesItem: unapprovedSalesItem
        });
    });
}