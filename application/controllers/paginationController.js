const db = require('../config/db');

// Handle pagination of search results on GET
exports.searchResults = (limit) => {
    const pageLimit = limit;

    return (req, res, next) => {
        let currentPage = parseInt(req.query.page) || 1;
        let keyword = req.query.k;
        let category = req.query.c;
        let priceFilter = req.query.pf;
        let conditionFilter = req.query.cond;
        let min, max = 0;
        let sql = "SELECT * FROM SalesItem";
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
            // Check if category criteria exist
            if (category && category != 'all') {
                sql += " WHERE (name LIKE ? OR description LIKE ?) AND category = ?";
                placeholders = ['%' + keyword + '%', '%' + keyword + '%', category];
                // Check if price filter exist
                if (priceFilter) {
                    sql += " AND (price > ?) AND (price < ?)";
                    placeholders.push(min, max);
                }
                // Check if condition filter exist
                if (conditionFilter) {
                    sql += " AND `condition` = ?";
                    placeholders.push(conditionFilter);
                }
            }
            // Keyword criteria exist, but category criteria does not
            else {
                sql += " WHERE (name LIKE ? OR description LIKE ?)";
                placeholders = ['%' + keyword + '%', '%' + keyword + '%'];
                // Check if price filter exist
                if (priceFilter) {
                    sql += " AND (price > ?) AND (price < ?)";
                    placeholders.push(min, max);
                }
                // Check if condition filter exist
                if (conditionFilter) {
                    sql += " AND `condition` = ?";
                    placeholders.push(conditionFilter);
                }
            }
        }
        // Keyword criteria does not exist, check if category criteria exist
        else if (category && category != 'all') {
            sql += " WHERE category = ?";
            placeholders = [category];
            // Check if price filter exist
            if (priceFilter) {
                sql += " AND (price > ?) AND (price < ?)";
                placeholders.push(min, max);
            }
            // Check if condition filter exist
            if (conditionFilter) {
                sql += " AND `condition` = ?";
                placeholders.push(conditionFilter);
            }
        }
        // Keyword and category criteria does not exist
        else {
            // Check if price filter exists
            if (priceFilter) {
                sql += " WHERE (price > ?) AND (price < ?)";
                placeholders.push(min, max);
                // Check if condition filter exists
                if (conditionFilter) {
                    sql += " AND `condition` = ?";
                    placeholders.push(conditionFilter);
                }
            }
            // Check if condition filter exists
            else if (conditionFilter) {
                sql += " WHERE `condition` = ?";
                placeholders.push(conditionFilter);
            }
        }

        res.locals.sql = sql;
        res.locals.placeholders = placeholders;
        res.locals.pageLimit = pageLimit;
        res.locals.currentPage = currentPage;

        db.query(sql, placeholders, (error, result) => {
            if (error) throw (error);

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