/* This file handles "/user" route */

const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { ensureStudentAuthenticated, forwardAuthenticated } = require('../controllers/userAuthenticated');

// GET request to redirect to student login page
router.get('/', (req, res) => {
    res.redirect('/user/login');
});

// GET student's login page
router.get('/login', forwardAuthenticated, studentController.login_get);

// POST request for authenticating student login
router.post('/login', studentController.login_post);

// GET student registration page
router.get('/register', forwardAuthenticated, studentController.register_get);

// POST request for student registration page
router.post('/register', studentController.register_post);

// GET request for student logout
router.get('/logout', ensureStudentAuthenticated, studentController.logout);

// GET student's dashboard page
router.get('/dashboard', ensureStudentAuthenticated, studentController.dashboard);

module.exports = router;