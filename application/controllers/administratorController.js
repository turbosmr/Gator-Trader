const passport = require('passport');

// Display administrator's dashboard page on GET
exports.index = (req, res, next) => {
    res.render('dashboard')
}

// Display administrator's login page on GET
exports.login_get = (req, res, next) => {
    res.render('adminLogin');
}

// Handle administrator login authentication via Passport API on POST
exports.login_post = (req, res, next) => {
    passport.authenticate('administrator-login', {
        successRedirect: '/admin',
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