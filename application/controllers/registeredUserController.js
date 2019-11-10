const db = require('../config/db');
const passport = require('passport');
const validator = require('email-validator');
const bcrypt = require('bcryptjs');

// Handle showing registered user login page on GET
exports.login_get = (req, res, next) => {
    res.render('registeredUserLogin');
}

// Handle registered user login authentication via Passport API on POST
exports.login_post = (req, res, next) => {
    passport.authenticate('registered-user-login', {
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true,
        badRequestMessage: 'Please fill in all fields'
    })(req, res, next);
}

// Handle showing registration page for registered user on GET
exports.register_get = (req, res, next) => {
    res.render('register');
}

// Handle registration for registered user on POST
exports.register_post = (req, res, next) => {
    let { username, sid, password, password2 } = req.body;
    let regError = [];

    // Check required fields
    if (!username || !sid || !password || !password2) {
        regError.push({ message: 'Please fill in all fields' });
    }
    else {
        if (!(validator.validate(username))) {
            regError.push({ message: 'Invalid SFSU email' });
        }
        // Check if SFSU ID is exactly 9 characters
        if (sid.length !== 9) {
            regError.push({ message: 'Invalid SFSU ID' });
        }
        // Check if password is between 8-20 characters
        if (password.length < 8 || password.length > 20) {
            regError.push({ message: 'Password must be between 8-20 characters' });
        }
        // Check if passwords match
        if (password !== password2) {
            regError.push({ message: 'Passwords do not match' });
        }
    }

    // Render registration error messages if necessary
    if (regError.length > 0) {
        res.render('register', {
            regError
        });
    }
    else {
        // Input validation passed
        // Check if username already exists
        db.query("SELECT * FROM RegisteredUser WHERE sid = ? OR username = ?", [sid, username], (err, result) => {
            if (err) throw err;

            if (result.length >= 1) {
                regError.push({ message: 'Such user already exists. Please log in.' });
                res.render('register', {
                    regError
                });
            }
            else {
                // Create a hashed password
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) throw err;

                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) throw err;

                        password = hash;
                        
                        // Insert new user into database
                        db.query("INSERT INTO RegisteredUser (sid, username, password) VALUES (?, ?, ?)", [sid, username, password], (error, result) => {
                            if (err) throw err;
                            
                            req.flash('success', 'Successfully registered, please login.');
                            res.redirect('/user/login');
                        });
                    });
                });
            }
        });
    }
}

// Handle registered user logout on GET
exports.logout = (req, res, next) => {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/');
}

// Display registered user's dashboard page on GET
// Contains list of sales item listed by current registered user
exports.dashboard = (req, res, next) => {
    // Retrieve sales items listed by current registered user
    if (req.user) {
        let product = [];
        let sql = "SELECT SalesItem.name, SalesItem.status, Category.name AS category, SalesItem.price FROM SalesItem INNER JOIN Category ON SalesItem.category = Category.cid WHERE seller = ?";
        let placeholders = [req.user.sid];

        db.query(sql, placeholders, (error, result) => {
            if (error) throw error;

            for (let i = 0; i < result.length; i++) {
                product.push(result[i]);
            }

            res.render('registeredUserDashboard', { product: product });
        });
    }
    else {
        res.render('registeredUserDashboard');
    }
}