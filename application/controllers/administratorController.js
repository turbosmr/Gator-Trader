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

//Handle the list of approved and unapproved items for admin.
// Author @Osbaldo Martinez
exports.items = (req, res, next) => {
    let approved = [];
    let unapproved = [];
    let sql = "SELECT * FROM SalesItem"; 
   db.query(sql, (err, result) =>{
        for (let i = 0; i < result.length; i++) {
            if(result[i].status == "approved") {
                approved.push(result[i])
            } else {
                unapproved.push(result[i]);
            }
        }
        res.render('adminDashboard',{
            approved_items: approved,
            unapproved_items: unapproved
        });
   });
}

// Display administrator's dashboard page on GET
exports.dashboard = (req, res, next) => {
    res.render('adminDashboard');
}