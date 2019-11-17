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
}

// Handle rendering of search results on GET
exports.get = (req, res, next) => {
    let product = [];
    let searchCriteria = {};
    searchCriteria.keyword = req.query.k;
    searchCriteria.selectedCategoryVal = req.query.c;
    searchCriteria.priceFilter = res.locals.priceFilter;
    searchCriteria.conditionFilter = res.locals.conditionFilter;
    searchCriteria.sortF = res.locals.sortF;

    if (res.locals.totalPages > 0) {
        if (res.locals.currentPage > res.locals.totalPages || res.locals.currentPage < 1) {
            return res.redirect('/');
        }
    }

    let offset = (res.locals.pageLimit * res.locals.currentPage) - res.locals.pageLimit;

    if (offset < 0) {
        limit += offset;
        offset = 0;
    }

    res.locals.sql += " LIMIT ? OFFSET ?";
    res.locals.placeholders.push(res.locals.pageLimit, offset);

    if (typeof selectedCategoryVal !== 'undefined') {
        db.query('SELECT name FROM Category WHERE cid = ?', searchCriteria.selectedCategoryVal, (err, result) => {
            if (err) throw err;
    
            if (result.length > 0) {
                searchCriteria.selectedCategoryName = result[0].name;
            }
        });
    }

    db.query(res.locals.sql, res.locals.placeholders, (err, result) => {
        if (err) throw err;

        for (let i = 0; i < result.length; i++) {
            product.push(result[i]);
        }

        res.render('results', {
            product: product,
            searchCriteria: searchCriteria,
            pageLimit: res.locals.pageLimit,
            offset: offset,
            totalProducts: res.locals.totalProducts,
            pageCount: res.locals.totalPages,
            currentPage: res.locals.currentPage
        });
    });
}

// Handle rendering of search suggestions on GET
// Author @Osbaldo Martinez
exports.suggestions = (req, res, next) => {
    let sql = "SELECT * FROM SalesItem WHERE name LIKE ? OR description LIKE ?";
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