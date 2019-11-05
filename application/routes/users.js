/* This file handles "/users" route */

const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// GET request to redirect to login page
router.get('/', (req, res) => {
    res.redirect('users/login');
});

// GET user login page
router.get('/login', (req, res) => {
    res.render('login');
});

// GET user registration page
router.get('/register', (req, res) => {
    res.render('register');
});

// POST request for authenticating user login
router.post('/login', usersController.login);

// POST request for user registration
router.post('/register', usersController.register);

// GET request for user logout
router.get('/logout', usersController.logout);

module.exports = router;