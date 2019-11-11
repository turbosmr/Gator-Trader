/* This file handles "/admin" route */

const express = require('express');
const router = express.Router();
const administratorController = require('../controllers/administratorController');
const { ensureAdminAuthenticated, forwardAuthenticated } = require('../controllers/userAuthenticated');

// GET request to redirect to registered user login page
router.get('/', (req, res) => {
    res.redirect('admin/login');
});

// GET administrator's login page
router.get('/login', forwardAuthenticated, administratorController.login_get);

// POST request for authenticating administrator login
router.post('/login', administratorController.login_post);

// GET request for administrator logout
router.get('/logout', ensureAdminAuthenticated, administratorController.logout);

// GET administrator's dashboard page
router.get('/dashboard', ensureAdminAuthenticated, administratorController.dashboard);

module.exports = router;