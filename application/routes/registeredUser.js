/* This file handles "/users" route */

const express = require('express');
const router = express.Router();
const registeredUserController = require('../controllers/registeredUserController');

// GET request to redirect to registered user login page
router.get('/', (req, res) => {
    res.redirect('user/login');
});

// GET registered user login page
router.get('/login', registeredUserController.login_get);

// POST request for authenticating registered user login
router.post('/login', registeredUserController.login_post);

// GET registration page for registered user
router.get('/register', registeredUserController.register_get);

// POST request for registration page of registered user
router.post('/register', registeredUserController.register_post);

// GET request for registered user logout
router.get('/logout', registeredUserController.logout);

// GET registered user's dashboard page
router.get('/dashboard', registeredUserController.dashboard);

module.exports = router;