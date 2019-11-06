/* This file handles "/search" route */

const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const paginationController = require('../controllers/paginationController');

// POST request for search
router.post('/', searchController.post);

// GET request to paginate and show search results
router.get('/', paginationController.search_results(10), searchController.get);

// GET request for search suggestions
router.get('/suggestions/typeahead', searchController.suggestions);

module.exports = router;