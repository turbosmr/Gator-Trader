const db = require('../config/db');
const passport = require('passport');
const emailValidator = require('../util/email-validator');
const bcrypt = require('bcryptjs');

// Handle showing registered user login page on GET
exports.login_get = (req, res, next) => {
    let redirectUrl = req.query.redirectUrl;

    if (!redirectUrl) {
        redirectUrl = req.get('Referrer');
    }

    res.render('registeredUserLogin', {
        redirectUrl: redirectUrl
    });
}

// Handle registered user login authentication via Passport API on POST
exports.login_post = (req, res, next) => {
    let redirectUrl = req.query.redirectUrl;

    if (redirectUrl == '') {
        redirectUrl = '/user/dashboard';
    }

    passport.authenticate('registered-user-login', {
        successRedirect: redirectUrl,
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
    let dataPassedBack = {};

    // Check required fields
    if (!username || !sid || !password || !password2) {
        regError.push({ message: 'Please fill in all fields' });
    }
    else {
        // Check if SFSU email is valid (i.e. contains a valid domain and email is <= 40 characters)
        if (!(emailValidator.validate(username)) || username.length > 40) {
            regError.push({ message: 'Invalid SFSU email' });
        }
        // Check if SFSU ID is valid (i.e. a 9-digit number that starts with 9)
        if (!(/^\d+$/.test(sid)) || !sid.startsWith("9") || sid.length !== 9) {
            dataPassedBack.username = username;
            regError.push({ message: 'Invalid SFSU ID' });
        }
        // Check if password is between 8-20 characters
        if (password.length < 8 || password.length > 20) {
            dataPassedBack.username = username;
            dataPassedBack.sid = sid;
            regError.push({ message: 'Password must be between 8-20 characters' });
        }
        // Check if passwords match
        if (password !== password2) {
            dataPassedBack.username = username;
            dataPassedBack.sid = sid;
            regError.push({ message: 'Passwords do not match' });
        }
    }

    // Render registration error messages if necessary
    if (regError.length > 0) {
        res.render('register', {
            regError,
            dataPassedBack
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
// Retrieve list of sales item listed by the registered user that is logged in
// Retrieve list of inquiries of their own items and other items
exports.dashboard = (req, res, next) => {
    let loggedInUser = req.user.sid;
    let product = [];
    let inquiry = [];
    let sql = "SELECT SI.pid, SI.name, SI.seller, SI.status, Category.name AS category, CAST(SI.price AS CHAR) AS price, SIP.fileName AS photoFileName FROM SalesItem SI INNER JOIN Category ON SI.category = Category.cid LEFT JOIN SalesItemPhoto SIP on SIP.product = (SELECT product FROM SalesItemPhoto SIP2 WHERE SIP2.product = SI.pid LIMIT 1) GROUP BY SI.pid, SI.seller, SI.status HAVING SI.seller = ?;";
    sql += "SELECT SI.pid AS pid, SI.name AS productName, RU2.sid AS messageFromSid, RU2.username AS messageFromEmail, M.message AS lastMessage, DATE_FORMAT(convert_tz(MAX(M.time),@@session.time_zone,'-08:00'), '%m-%d-%Y %h:%i %p') AS time, I.iid AS inquiryId FROM Message M INNER JOIN Inquiry I on M.inquiry = I.iid INNER JOIN SalesItem SI on I.product = SI.pid INNER JOIN RegisteredUser RU on SI.seller = RU.sid INNER JOIN RegisteredUser RU2 on M.from = RU2.sid WHERE I.inquirer = ? OR SI.seller = ? GROUP BY productName ORDER BY MAX(M.time) DESC;";
    let placeholders = [loggedInUser, loggedInUser, loggedInUser];

    db.query(sql, placeholders, (error, result) => {
        if (error) throw error;

        let products = result[0];
        let inquiries = result[1];

        for (let i = 0; i < products.length; i++) {
            product.push(products[i]);
        }

        for (let i = 0; i < inquiries.length; i++) {
            inquiry.push(inquiries[i]);
        }

        res.render('registeredUserDashboard', { 
            product: product,
            inquiry: inquiry
        });
    });
}