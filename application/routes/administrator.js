/* This file handles "/dashboard" route */

const express = require('express');
const router = express.Router();
const admin = require('../controllers/administratorController');

// GET administrator's dashboard page
router.get('/', admin.index);

// GET administrator's login page
router.get('/login', admin.login_get);

// POST request for authenticating administrator login
router.post('/login', admin.login_post);

// GET request for administrator logout
router.get('/logout', admin.logout);

module.exports = router;