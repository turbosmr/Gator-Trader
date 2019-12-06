const db = require('../config/db');
const passport = require('passport');
const emailValidator = require('../util/email-validator');
const bcrypt = require('bcryptjs');

// Handle showing student login page on GET
exports.login_get = (req, res, next) => {
    let redirectUrl = req.query.redirectUrl;

    if (!redirectUrl) {
        redirectUrl = req.get('Referrer');
    }

    res.render('studentLogin', {
        redirectUrl: redirectUrl
    });
}

// Handle student login authentication via Passport API on POST
exports.login_post = (req, res, next) => {
    let { terms } = req.body;
    let redirectUrl = req.query.redirectUrl;

    // Lazy login; set redirect url so that user is redirected back to appropriate page
    if (redirectUrl == '') {
        redirectUrl = '/user/dashboard';
    }

    // Check if terms and conditions is checked
    if (!terms) {
        res.render('studentLogin', { 
            message: 'Please indicate that you agree to the terms and conditions.' 
        });
    }
    // Proceed with login authentication
    else {
        passport.authenticate('student-login', {
            successRedirect: redirectUrl,
            failureRedirect: '/user/login',
            failureFlash: true,
            badRequestMessage: 'Please fill in all fields'
        })(req, res, next);
    }
}

// Handle showing registration page for student on GET
exports.register_get = (req, res, next) => {
    res.render('register');
}

// Handle registration for student on POST
exports.register_post = (req, res, next) => {
    let { username, sid, password, confirmPassword, terms, captcha } = req.body;
    let regError = [];
    let dataPassedBack = {};

    // Check if required fields are filled
    if (!username || !sid || !password || !confirmPassword) {
        regError.push({ message: 'Please fill in all fields' });
    }
    // Check if terms and conditions is checked
    else if (!terms) {
        regError.push({ message: 'Please indicate that you agree to the terms and conditions.' });
    }
    // Check if captcha is checked
    else if (!captcha) {
        regError.push({ message: 'Please indicate that you are not a robot.' });
    }
    // Validate input fields
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
        if (password !== confirmPassword) {
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
    // Input validation passed
    else {
        // Check if username already exists
        db.query("SELECT * FROM Students WHERE sid = ? OR username = ?", [sid, username], (err, result) => {
            if (err) throw err;

            if (result.length > 0) {
                regError.push({ message: 'Such user already exists. Please log in.' });
                res.render('studentLogin', {
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
                        db.query("INSERT INTO Students (sid, username, password) VALUES (?, ?, ?)", [sid, username, password], (error, result) => {
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

// Handle student logout on GET
exports.logout = (req, res, next) => {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/');
}

// Display student's dashboard page on GET
// Retrieve list of sales item listed by the student that is logged in
// Retrieve list of inquiries of their own items and other items
exports.dashboard = (req, res, next) => {
    let loggedInUser = req.user.sid;
    let product = [];
    let inquiry = [];

    // Retrieve pid, name, price, status, and date created of all sales items that are sold by the user that is logged in, and sort it by most recently created. Also, cast sales item price to CHAR to show leading zeros in view page.
    let sql = "SELECT SI.pid AS pid, SI.name AS name, CAST(SI.price AS CHAR) AS price, SI.status AS status, DATE_FORMAT(convert_tz(SI.submittedAt,@@session.time_zone,'-08:00'), '%m-%d-%Y %h:%i %p') AS dateCreated FROM SalesItems SI WHERE SI.seller = ? ORDER BY SI.submittedAt DESC;";
    
    // Retrieve information of all inquiries of all sales items that the logged in user is inquiring about or is selling and sort it by last received
    sql += "SELECT SI.pid AS pid, SI.name AS productName, S2.sid AS messageFromSid, S2.username AS messageFromEmail, M.message AS lastMessage, DATE_FORMAT(convert_tz(MAX(M.time),@@session.time_zone,'-08:00'), '%m-%d-%Y %h:%i %p') AS time, I.iid AS inquiryId FROM Messages M INNER JOIN Inquiries I on M.inquiry = I.iid INNER JOIN SalesItems SI on I.product = SI.pid INNER JOIN Students S on SI.seller = S.sid INNER JOIN Students S2 on M.from = S2.sid WHERE I.inquirer = ? OR SI.seller = ? GROUP BY productName ORDER BY MAX(M.time) DESC;";
    
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

        res.render('studentDashboard', { 
            product: product,
            inquiry: inquiry
        });
    });
}