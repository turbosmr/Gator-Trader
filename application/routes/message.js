/* This file handles "/message" route */

const express = require('express');
const router = express.Router();
const { ensureRegisteredUserAuthenticated } = require('../controllers/userAuthenticated');
const messageController = require('../controllers/messageController');

// GET message page
router.get('/', messageController.get);

// POST request to send message
router.post('/', messageController.post);

module.exports = router;