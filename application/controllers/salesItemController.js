const db = require('../config/db');

// Show sales item page on GET
exports.salesItem_get = (req, res, next) => {
    let productId = req.params.pid;
    let sql = "SELECT SI.*, CAST(SI.price AS CHAR) AS price, RU.username AS sellerEmail FROM SalesItem SI INNER JOIN RegisteredUser RU on SI.seller = RU.sid WHERE SI.pid = ?;";
    sql += "SELECT fileName as photoFileName FROM SalesItemPhoto WHERE product = ?;";
    sql += "SELECT * FROM PickupLocation WHERE product = ?;"
    let placeholders = [productId, productId, productId];
    let objToBePassed = {};

    db.query(sql, placeholders, (err, result) => {
        if (err) {
            res.render('error');
        }

        // Item found
        if (result[0].length !== 0) {
            objToBePassed.salesItem = result[0][0];
            objToBePassed.salesItemPhoto = result[1];
            objToBePassed.pickupLocation = result[2];

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
        // Item not found
        else {
            res.render('error');
        }
    });
}

// Show sell page for revising sales item on GET
exports.edit_get = (req, res, next) => {
    let productId = req.params.pid;
    let seller = req.user.sid;
    let sql = "SELECT *, CAST(price AS CHAR) AS price FROM SalesItem WHERE pid = ? AND seller = ?;";
    sql += "SELECT * FROM ClassSection;";
    sql += "SELECT * FROM PickupLocation WHERE product = ?"
    placeholders = [productId, seller, productId];

    db.query(sql, placeholders, (err, result) => {
        if (err) {
            res.render('error');
        }

        if (typeof result[0][0] == 'undefined') {
            res.render('error');
        }
        else {
            res.render('sell', {
                salesItem: result[0][0],
                classSection: result[1],
                pickupLocation: result[2],
                reviseMode: true
            });
        }
    });
}

// Handle submitting revision of sales item on POST
exports.edit_post = (req, res, next) => {
    let productId = req.params.pid;
    let { productName, price, category, classMaterialSection, condition, quantity, deliveryMethod, description } = req.body;
    let salesItemImages = req.files;
    let sql = "";
    let placeholders = [];
    let tempDeliveryMethod = deliveryMethod;
    let salesItemPlaceholders = [];

    // Check if delivery method is shipping only, pickup only, or both
    if (Array.isArray(tempDeliveryMethod)) {
        // Shipping and pickup
        if (tempDeliveryMethod.includes("shipping")) {
            deliveryMethod = 3;
        }
        // Pickup only (multiple locations)
        else {
            deliveryMethod = 2;
        }
    }
    else {
        // Shipping only
        if (tempDeliveryMethod == "shipping") {
            deliveryMethod = 1;
        }
        // Pickup only (single location)
        else {
            deliveryMethod = 2;
        }
    }

    // Check if class material section field is empty
    if (classMaterialSection != '') {
        sql += "UPDATE SalesItem SET category = ?, name = ?, price = ?, `condition` = ?, quantity = ?, description = ?, deliveryMethod = ?, classMaterialSection = ? WHERE pid = ?;";
        salesItemPlaceholders = [category, productName, price, condition, quantity, description, deliveryMethod, classMaterialSection, productId];
        placeholders.push(...salesItemPlaceholders);
    }
    else {
        sql += "UPDATE SalesItem SET category = ?, name = ?, price = ?, `condition` = ?, quantity = ?, description = ?, deliveryMethod = ?, classMaterialSection = NULL WHERE pid = ?;";
        salesItemPlaceholders = [category, productName, price, condition, quantity, description, deliveryMethod, productId];
        placeholders.push(...salesItemPlaceholders);
    }

    // Store pickup location in DB
    // First remove existing pickup locations
    sql += "DELETE FROM PickupLocation WHERE product = ?;";
    placeholders.push(productId);

    // Pickup only (multiple locations) or shipping & pickup
    if (Array.isArray(tempDeliveryMethod)) {
        for (let i = 0; i < tempDeliveryMethod.length; i++) {
            // Make sure "shipping" is not included as a location
            if (tempDeliveryMethod[i] != "shipping") {
                sql += "INSERT INTO PickupLocation (product, location) VALUES (?, ?);";
                placeholders.push(productId);
                if (tempDeliveryMethod[i] == "library") {
                    placeholders.push(1);
                }
                else if (tempDeliveryMethod[i] == "student-center") {
                    placeholders.push(2);
                }
                else {
                    placeholders.push(3);
                }
            }
        }
    }
    // Single pickup location
    else if (tempDeliveryMethod != "shipping") {
        sql += "INSERT INTO PickupLocation (product, location) VALUES (?, ?);";
        placeholders.push(productId);
        if (tempDeliveryMethod == "library") {
            placeholders.push(1);
        }
        else if (tempDeliveryMethod == "student-center") {
            placeholders.push(2);
        }
        else {
            placeholders.push(3);
        }
    }

    // Check if there are new photo(s) being uploaded
    if (salesItemImages.length > 0) {
        // First, remove existing sales item photo(s) 
        sql += "DELETE FROM SalesItemPhoto WHERE product = ?;";
        placeholders.push(productId);

        // Save filename of uploaded sales item photo(s)
        for (let i = 0; i < salesItemImages.length; i++) {
            sql += "INSERT INTO SalesItemPhoto (product, fileName) VALUES (?, ?);";
            placeholders.push(productId);
            placeholders.push(salesItemImages[i].filename);
        }
    }

    db.query(sql, placeholders, (err, result) => {
        if (err) {
            req.flash('error', 'Error submitting revision');
            res.redirect('/products/' + req.params.pid + '/edit');
        }

        if (typeof result !== 'undefined') {
            req.flash('success', 'Successfully revised item');
            res.redirect('/user/dashboard');
        }
    });
}

// Handle ending listing of sales item on GET
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

// Handle relisting sales item on GET
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

// Handle showing contact seller page on GET
exports.inquiry_get = (req, res, next) => {
    let productId = req.params.pid;
    let inquiryId = req.query.id;
    let loggedInUser = req.user.sid;
    let messages = [];
    let sql = "";
    let placeholders = [];

    // Check if ".../inquiry?id=[inquiryId]" exist
    if (typeof inquiryId !== "undefined") {
        sql = "SELECT SI.*, CAST(SI.price AS CHAR) AS price, RU.username AS sellerEmail FROM SalesItem SI INNER JOIN RegisteredUser RU on SI.seller = RU.sid WHERE SI.pid = ?;"
        sql += "SELECT fileName as photoFileName FROM SalesItemPhoto WHERE product = ?;";
        sql += "SELECT RU2.sid AS senderSid, RU2.username AS senderEmail, M.message AS message, M.time AS time FROM Inquiry I INNER JOIN Message M on I.iid = M.inquiry INNER JOIN SalesItem SI on I.product = SI.pid INNER JOIN RegisteredUser RU on SI.seller = RU.sid INNER JOIN RegisteredUser RU2 on M.from = RU2.sid WHERE I.iid = ? AND I.product = ? AND (I.inquirer = ? OR SI.seller = ?) ORDER BY time ASC;";
        sql += "SELECT * FROM PickupLocation WHERE product = ?;"
        placeholders = [productId, productId, inquiryId, productId, loggedInUser, loggedInUser, productId];

        db.query(sql, placeholders, (err, result) => {
            if (err) {
                res.render('error');
            }

            // Item found
            if (result[0].length !== 0) {
                let salesItem = result[0][0];
                let salesItemPhoto = result[1];
                let pickupLocation = result[3];

                // Inquiry found
                if (result[2].length !== 0) {
                    for (let i = 0; i < result[2].length; i++) {
                        messages.push(result[2][i]);
                    }

                    res.render('testInquiry', {
                        salesItem: salesItem,
                        salesItemPhoto: salesItemPhoto,
                        messages: messages,
                        pickupLocation: pickupLocation
                    });
                }
                // Inquiry not found
                else {
                    res.redirect('/products/' + salesItem.pid + '/inquiry');
                }
            }
            // Item not found
            else {
                res.render('error');
            }
        });
    }
    else {
        sql = "SELECT SI.*, CAST(SI.price AS CHAR) AS price, RU.username AS sellerEmail FROM SalesItem SI INNER JOIN RegisteredUser RU on SI.seller = RU.sid WHERE SI.pid = ?;";
        sql += "SELECT fileName as photoFileName FROM SalesItemPhoto WHERE product = ?;";
        sql += "SELECT * FROM Inquiry I INNER JOIN Message M on I.iid = M.inquiry INNER JOIN SalesItem SI on I.product = SI.pid INNER JOIN RegisteredUser RU on SI.seller = RU.sid WHERE I.product = ? AND I.inquirer = ?;";
        sql += "SELECT * FROM PickupLocation WHERE product = ?;"
        placeholders = [productId, productId, productId, loggedInUser, productId];

        db.query(sql, placeholders, (err, result) => {
            if (err) {
                res.render('error');
            }

            // Item found
            if (result[0].length !== 0) {
                let salesItem = result[0][0];
                let salesItemPhoto = result[1];
                let pickupLocation = result[3];

                // Inquiry not found
                if (result[2].length == 0) {
                    // Check if user looking to inquire is the seller of the item
                    if (salesItem.seller == loggedInUser) {
                        res.render('error', {
                            error: 'Sorry, but sellers are not permitted to inquire their own items.',
                            advice: 'Please check your dashboard for inquiries of your items.'
                        });
                    }
                    else {
                        res.render('testInquiry', {
                            salesItem: salesItem,
                            salesItemPhoto: salesItemPhoto,
                            pickupLocation: pickupLocation
                        });
                    }
                }
                // Inquiry found
                else {
                    let inquiry = result[2][0];

                    res.redirect('/products/' + productId + '/inquiry?id=' + inquiry.iid);
                }
            }
            // Item not found
            else {
                res.render('error');
            }
        });
    }
}

// Handle sending message in contact seller page on POST
exports.inquiry_post = (req, res, next) => {
    let productId = req.params.pid;
    let inquiryId = req.query.id;
    let sender = req.user.sid;
    let { message } = req.body;
    let sql = "";
    let placeholders = [];

    if (typeof inquiryId !== "undefined") {
        sql += "INSERT INTO Message (inquiry, `from`, message) VALUES (?, ?, ?);";
        placeholders = [inquiryId, sender, message];
    }
    else {
        sql = "INSERT INTO Inquiry (product, inquirer) VALUES (?, ?);"
        placeholders = [productId, sender];
    }

    db.query(sql, placeholders, (err, result) => {
        if (err) {
            res.render('error');
        }

        if (typeof inquiryId !== "undefined") {
            if (result.affectedRows > 0) {
                res.redirect('/products/' + productId + '/inquiry?id=' + inquiryId);
            }
            else {
                res.render('error');
            }
        }
        else {
            if (result.affectedRows > 0) {
                inquiryId = result.insertId;
                sql = "INSERT INTO Message (inquiry, `from`, message) VALUES (?, ?, ?);";
                placeholders = [inquiryId, sender, message];

                db.query(sql, placeholders, (err, result) => {
                    if (result.affectedRows > 0) {
                        res.redirect('/products/' + productId + '/inquiry?id=' + inquiryId);
                    }
                    else {
                        res.render('error');
                    }
                });
            }
        }
    });

/*     console.log('productId: ' + productId)
    console.log('inquiryId: ' + inquiryId)
    console.log('message: ' + message) */

}