/* This file handles "/dashboard" route */

const express = require('express');
const router = express.Router();
const administratorController = require('../controllers/administratorController');

// GET request to redirect to registered user login page
router.get('/', (req, res) => {
    res.redirect('admin/login');
});

// GET administrator's login page
router.get('/login', administratorController.login_get);

// POST request for authenticating administrator login
router.post('/login', administratorController.login_post);

// GET request for administrator logout
router.get('/logout', administratorController.logout);

// GET administrator's dashboard page
router.get('/dashboard', administratorController.dashboard);

//GET request to get approved and unapproved items
router.get('/items', administratorController.items);

module.exports = router;