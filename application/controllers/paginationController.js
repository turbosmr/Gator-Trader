const db = require('../config/db');

// Handle pagination of search results on GET
exports.search_results = (limit) => {
    const pageLimit = limit;

    return (req, res, next) => {
        let currentPage = parseInt(req.query.page) || 1;
        let keyword = req.query.k;
        let category = req.query.c;
        let priceFilter = req.query.pf;
        let min, max = 0;
        let conditionFilter = req.query.cond;
        let sortF = (req.query.sort) ? req.query.sort : "ltoh";
        let sql = "SELECT * FROM SalesItem WHERE status = 'approved'";
        let placeholders = [];

        if (priceFilter == "under25") {
            min = -0.01;
            max = 25.00;
        }
        else if (priceFilter == "25to50") {
            min = 24.99;
            max = 50.00;
        }
        else if (priceFilter == "50to200") {
            min = 49.99;
            max = 200.00;
        }
        else if (priceFilter == "over200") {
            min = 199.99;
            max = 99999.99;
        }
        else {
            priceFilter = undefined;
        }

        // Check if keyword criteria exist
        if (keyword) {
            sql += " AND (name LIKE ? OR description LIKE ?)";
            let likeKeyword = '%' + keyword + '%';
            placeholders.push(likeKeyword);
            placeholders.push(likeKeyword);
        }

        // Check if category criteria exist
        if (category && category != 'all') {
            sql += " AND category = ?";
            placeholders.push(category);
        }

        // Check if price filter exist
        if (priceFilter) {
            sql += " AND (price > ?) AND (price < ?)";
            placeholders.push(min);
            placeholders.push(max);
        }

        // Check if condition filter exist
        if (conditionFilter) {
            sql += " AND `condition` = ?";
            placeholders.push(conditionFilter);
        }

        // Check if sort by exist
        if (sortF) {
            // Check if sort alphabetically: A-Z exist
            if (sortF == "atoz") {
                sql += " ORDER BY name ASC";
            }
            // Check if sort by price: low to high exist
            else if (sortF == "ltoh") {
                sql += " ORDER BY price ASC";
            }
            // Check if sort by price: high to low exist
            else if (sortF == "htol") {
                sql += " ORDER BY price DESC";
            }
        }

        res.locals.priceFilter = priceFilter;
        res.locals.conditionFilter = conditionFilter;
        res.locals.sortF = sortF;

        res.locals.sql = sql;
        res.locals.placeholders = placeholders;

        res.locals.pageLimit = pageLimit;
        res.locals.currentPage = currentPage;

        db.query(sql, placeholders, (err, result) => {
            if (err) throw (err);

            res.locals.totalPages = Math.ceil(parseInt(result.length) / pageLimit);
            res.locals.totalProducts = result.length;

            next();
        });
    }
}

// Handle pagination of active listings
exports.activeListings = (req, res, next) => {

}

// Handle pagination of messages
exports.messages = (req, res, next) => {

}