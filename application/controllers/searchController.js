const db = require('../config/db');

// Handle search redirection on POST
exports.post = (req, res, next) => {
    let keyword = req.body.keyword;
    let category = req.body.categories;

    if (keyword) {
        if (category) {
            res.redirect('/search?k=' + keyword + '&c=' + category);
        }
        else {
            res.redirect('/search?k=' + keyword);
        }
    }
    else if (category) {
        res.redirect('/search?c=' + category);
    }
    else {
        res.redirect('/search?c=all');
    }
}

// Handle rendering of search results on GET
exports.get = (req, res, next) => {
    let sql = res.locals.sql;
    let placeholders = res.locals.placeholders;
    let product = [];
    let pageLimit = res.locals.pageLimit;
    let currentPage = res.locals.currentPage;
    let totalPages = res.locals.totalPages;
    let offset = (pageLimit * currentPage) - pageLimit;
    let totalProducts = res.locals.totalProducts;
    let searchCriteria = {};
    searchCriteria.keyword = req.query.k;
    searchCriteria.selectedCategoryVal = req.query.c;
    searchCriteria.priceFilter = res.locals.priceFilter;
    searchCriteria.conditionFilter = res.locals.conditionFilter;
    searchCriteria.sortF = res.locals.sortF;

    if (totalPages > 0) {
        if (currentPage > totalPages || currentPage < 1) {
            return res.redirect('/');
        }
    }

    if (offset < 0) {
        limit += offset;
        offset = 0;
    }

    sql += " LIMIT ? OFFSET ?;";
    placeholders.push(pageLimit, offset);

    if (typeof searchCriteria.selectedCategoryVal !== 'undefined') {

        // Retrieve information of all sales item categories
        sql += "SELECT name FROM Categories WHERE cid = ?;";

        placeholders.push(searchCriteria.selectedCategoryVal);
    }

    db.query(sql, placeholders, (err, result) => {
        let salesItems = result[0];
        let selectedCategoryName = result[1];

        if (err) throw err;
        
        for (let i = 0; i < salesItems.length; i++) {
            product.push(salesItems[i]);
        }

        if (result[1].length > 0) {
            searchCriteria.selectedCategoryName = selectedCategoryName[0].name;
        }

        res.render('results', {
            product: product,
            searchCriteria: searchCriteria,
            pageLimit: pageLimit,
            offset: offset,
            totalProducts: totalProducts,
            pageCount: totalPages,
            currentPage: currentPage
        });
    });
}

// Handle rendering of search suggestions on GET
// Author @Osbaldo Martinez
exports.suggestions = (req, res, next) => {

    // Retrieve information of all active sales items
    let sql = "SELECT * FROM SalesItems WHERE (name LIKE ? OR description LIKE ?) AND status = 'Active'";
    
    let keyword = req.query.key;
    let product = [];

    db.query(sql, ['%' + keyword + '%', '%' + keyword + '%'], (err, result) => {
        if (err) throw err;

        for (let i = 0; i < result.length; i++) {
            product.push(result[i].name);
        }

        res.send(JSON.stringify(product));
    });
}