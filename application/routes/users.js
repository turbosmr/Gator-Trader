const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const validator = require('email-validator');
const db = require('../config/db');

// Handle '/users' route; redirect to login page
router.get('/', (req, res) => {
    res.redirect('users/login');
});

// Render user login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Render user registration page
router.get('/register', (req, res) => {
    res.render('register');
});

// Handle user login route; authentication using Passport
router.post('/login',
    passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true,
        badRequestMessage: 'Please fill in all fields'
    }),
    (req, res) => { }
);

// Handle user registration route
router.post('/register', (req, res) => {
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
        db.query("SELECT * FROM RegisteredUsers WHERE sid = ? OR email = ?", [sid, username], (error, result) => {
            if (error) throw error;
            if (result.length >= 1) {
                regError.push({ message: 'Such user already exists. Please log in.' });
                res.render('register', {
                    regError
                });
            }
            else {
                // Create a hashed password
                bcrypt.genSalt(10, (error, salt) => {
                    if (error) throw error;
                    bcrypt.hash(password, salt, (error, hash) => {
                        if (error) throw error;
                        password = hash;
                        // Insert new user into database
                        db.query("INSERT INTO RegisteredUsers (sid, email, password) VALUES (?, ?, ?)", [sid, username, password], (error, result) => {
                            if (error) throw error;
                            req.flash('success', 'Successfully registered, please login.');
                            res.redirect('/users/login');
                        });
                    });
                });
            }
        });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/');
});

module.exports = router;