/* This file handles "/users" route */

const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// GET request to redirect to registered user login page
router.get('/', (req, res) => {
    res.redirect('users/login');
});

// GET registered user login page
router.get('/login', usersController.login_get);

// POST request for authenticating registered user login
router.post('/login', usersController.login_post);

// GET registration page for registered user
router.get('/register', usersController.register_get);

// POST request for registration page of registered user
router.post('/register', usersController.register_post);

// GET request for registered user logout
router.get('/logout', usersController.logout);

module.exports = router;