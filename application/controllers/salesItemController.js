const db = require('../config/db');

// Handle showing sales item page on GET
exports.salesItem_get = (req, res, next) => {
    let sql = "SELECT SI.*, CAST(SI.price AS CHAR) AS price, RU.username AS sellerEmail FROM SalesItem SI INNER JOIN RegisteredUser RU on SI.seller = RU.sid WHERE SI.pid = ?";
    let objToBePassed = {};

    db.query(sql, [req.params.pid], (err, result) => {
        if (err) throw err;

        // Item not found
        if (result.length == 0) {
            res.render('error');
        }
        // Item found
        else {
            objToBePassed.salesItem = result[0];

            // Check if sales item belongs to registered user
            if (req.isAuthenticated() && result[0].seller == req.user.sid) {
                objToBePassed.isSeller = true;
            }

            // Check if administrator is logged in
            if (req.isAuthenticated() && req.user.aid) {
                objToBePassed.isAdmin = true;
            }

            if (result[0].status == 'unapproved' && (!(objToBePassed.isSeller) && !(objToBePassed.isAdmin))) {
                res.render('error');
            }
            else {
                res.render('salesItem', {
                    data: objToBePassed
                });
            }
        }
    });
}

// GET request to update sales item

// POST request to update sales item

// GET request to delete sales item