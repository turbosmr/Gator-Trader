const db = require('../config/db');

// Handle showing sales item page on GET
exports.salesItem_get = (req, res, next) => {
    let productId = req.params.pid;
    let sql = "SELECT SI.*, CAST(SI.price AS CHAR) AS price, RU.username AS sellerEmail FROM SalesItem SI INNER JOIN RegisteredUser RU on SI.seller = RU.sid WHERE SI.pid = ?;";
    sql += "SELECT fileName as photoFileName FROM SalesItemPhoto WHERE product = ?";
    let objToBePassed = {};

    db.query(sql, [productId, productId], (err, result) => {
        if (err) {
            res.render('error');
        }

        // Item not found
        if (result.length == 0) {
            res.render('error');
        }
        // Item found
        else {
            objToBePassed.salesItem = result[0][0];
            objToBePassed.salesItemPhoto = result[1];

            // Check if sales item belongs to registered user
            if (req.isAuthenticated() && result[0][0].seller == req.user.sid) {
                objToBePassed.isSeller = true;
            }

            // Check if administrator is logged in
            if (req.isAuthenticated() && req.user.aid) {
                objToBePassed.isAdmin = true;
            }

            res.render('salesItem', {
                data: objToBePassed
            });
        }
    });
}

// GET request to edit sales item
exports.edit_get = (req, res, next) => {
    let salesItem = {};
    let classSection = [];
    let sql = "SELECT *, CAST(price AS CHAR) AS price FROM SalesItem WHERE pid = ? AND seller = ?";

    db.query(sql, [req.params.pid, req.user.sid], (err, result) => {
        if (err) {
            res.render('error');
        }
        
        if (result.length == 0) {
            res.render('error');
        }
        else {
            salesItem = result[0];
        }
    });

    sql = "SELECT * FROM ClassSection";

    db.query(sql, (err, result) => {
        if (err) throw err;

        for (let i = 0; i < result.length; i++) {
            classSection.push(result[i]);
        }

        res.render('sell', {
            salesItem: salesItem,
            classSection: classSection
        });
    });
}

// POST request to edit sales item
exports.edit_post = (req, res, next) => {
    let productId = req.params.pid;
    let { productName, price, category, classMaterialSection, condition, quantity, deliveryMethod, description } = req.body;
    let salesItemImageFileName = req.file.filename;
    let sql = "";
    let placeholders = [];

    if (classMaterialSection != '') {
        sql = "UPDATE SalesItem SET category = ?, name = ?, price = ?, `condition` = ?, quantity = ?, description = ?, deliveryMethod = ?, photoFileName = ?, classMaterialSection = ? WHERE pid = ?";
        placeholders = [category, productName, price, condition, quantity, description, deliveryMethod, salesItemImageFileName, classMaterialSection, productId];
    }
    else {
        sql = "UPDATE SalesItem SET category = ?, name = ?, price = ?, `condition` = ?, quantity = ?, description = ?, deliveryMethod = ?, photoFileName = ?, classMaterialSection = NULL WHERE pid = ?";
        placeholders = [category, productName, price, condition, quantity, description, deliveryMethod, salesItemImageFileName, productId]
    }

    db.query(sql, placeholders, (err, result) => {
        if (err) {
            req.flash('error', 'Error submitting revision');
            res.redirect('/products/' + req.params.pid + '/edit');
        }

        if (result.changedRows >= 0) {
            req.flash('success', 'Successfully revised item');
            res.redirect('/user/dashboard');
        }
    });
}

// GET request to end sales item
exports.end = (req, res, next) => {
    let productId = req.params.pid;
    let seller = req.user.sid;
    let sql = "SELECT * FROM SalesItem WHERE pid = ? AND seller = ?";

    db.query(sql, [productId, seller], (err, result) => {
        if (err) {
            res.render('error');
        }

        if (result.length > 0) {
            sql = "UPDATE SalesItem SET status = 4 WHERE pid = ?";

            db.query(sql, [productId], (err, result) => {
                if (err) {
                    req.flash('error', 'Error ending item for same');
                    res.redirect('/user/dashboard');
                }

                if (result.changedRows > 0) {
                    req.flash('success', 'Sucessfully ended item for sale');
                    res.redirect('/user/dashboard');
                }
                else {
                    req.flash('error', 'Error ending item for sale');
                    res.redirect('/user/dashboard');
                }
            });
        }
        else {
            res.render('error');
        }
    });
}

// GET request to relist sales item
exports.relist = (req, res, next) => {
    let productId = req.params.pid;
    let seller = req.user.sid;
    let sql = "SELECT * FROM SalesItem WHERE pid = ? AND seller = ?";

    db.query(sql, [productId, seller], (err, result) => {
        if (err) {
            res.render('error');
        }

        if (result.length > 0) {
            sql = "UPDATE SalesItem SET status = 1 WHERE pid = ?";

            db.query(sql, [productId], (err, result) => {
                if (err) {
                    req.flash('error', 'Error relisting item');
                    res.redirect('/user/dashboard');
                }

                if (result.changedRows > 0) {
                    req.flash('success', 'Sucessfully relisted item');
                    res.redirect('/user/dashboard');
                }
                else {
                    req.flash('error', 'Error relisting item');
                    res.redirect('/user/dashboard');
                }
            });
        }
        else {
            res.render('error');
        }
    });
}