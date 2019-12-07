const db = require('../config/db');

// Show sales item page on GET
exports.salesItem_get = (req, res, next) => {
    let productId = req.params.pid;

    // Retrieve information of a sales item. Also, cast sales item price to CHAR to show leading zeros in view page, and include seller email.
    let sql = "SELECT SI.*, CAST(SI.price AS CHAR) AS price, S.username AS sellerEmail FROM SalesItems SI INNER JOIN Students S on SI.seller = S.sid WHERE SI.pid = ?;";
    
    // Retrieve all photos (filename) of a sales item
    sql += "SELECT fileName as photoFileName FROM SalesItemPhotos WHERE product = ?;";

    // Retrieve all pick up locations of a sales item
    sql += "SELECT * FROM PickupLocations WHERE product = ?;"

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

            // Check if sales item belongs to student that is currently logged in
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

    // Retrieve information of a sales item that is being sold by the logged in user
    let sql = "SELECT *, CAST(price AS CHAR) AS price FROM SalesItems WHERE pid = ? AND seller = ?;";

    // Retrieve information of all courses
    sql += "SELECT * FROM Courses;";

    // Retrieve all pick up locations of a sales item
    sql += "SELECT * FROM PickupLocations WHERE product = ?;"

    placeholders = [productId, seller, productId];

    db.query(sql, placeholders, (err, result) => {
        if (err) {
            res.render('error');
        }

        if (typeof result[0][0] == 'undefined') {
            res.render('error');
        }
        else {
            // Intepret and display newline
            result[0][0].description = result[0][0].description.replace(/<br>/g, "\n");

            res.render('sell', {
                salesItem: result[0][0],
                course: result[1],
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

    // Intepret and store newline
    description = description.replace(/\r\n|\r|\n/g, "<br>");

    // Check if class material section field is empty
    if (classMaterialSection != '') {
        
        // Update a sales item and set status to 'Unapproved'
        sql += "UPDATE SalesItems SET category = ?, name = ?, price = ?, `condition` = ?, quantity = ?, description = ?, deliveryMethod = ?, classMaterialSection = ?, status = 1 WHERE pid = ?;";
        
        salesItemPlaceholders = [category, productName, price, condition, quantity, description, deliveryMethod, classMaterialSection, productId];
        placeholders.push(...salesItemPlaceholders);
    }
    else {

        // Update a sales item and set status to 'Unapproved'
        sql += "UPDATE SalesItems SET category = ?, name = ?, price = ?, `condition` = ?, quantity = ?, description = ?, deliveryMethod = ?, classMaterialSection = NULL, status = 1 WHERE pid = ?;";
        
        salesItemPlaceholders = [category, productName, price, condition, quantity, description, deliveryMethod, productId];
        placeholders.push(...salesItemPlaceholders);
    }

    // Store pickup location in DB
    // First remove existing pickup locations
    sql += "DELETE FROM PickupLocations WHERE product = ?;";
    placeholders.push(productId);

    // Pickup only (multiple locations) or shipping & pickup
    if (Array.isArray(tempDeliveryMethod)) {
        for (let i = 0; i < tempDeliveryMethod.length; i++) {
            // Make sure "shipping" is not included as a location
            if (tempDeliveryMethod[i] != "shipping") {

                // Create a new pickup location that includes the product id and location
                sql += "INSERT INTO PickupLocations (product, location) VALUES (?, ?);";

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

        // Create a new pickup location that includes the product id and location
        sql += "INSERT INTO PickupLocations (product, location) VALUES (?, ?);";

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
        sql += "DELETE FROM SalesItemPhotos WHERE product = ?;";
        placeholders.push(productId);

        // Save filename of uploaded sales item photo(s)
        for (let i = 0; i < salesItemImages.length; i++) {

            // Create a new sales item photo that includes product id and filename of photo
            sql += "INSERT INTO SalesItemPhotos (product, fileName) VALUES (?, ?);";

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

    // Retrieve information of a sales item that is being sold by the logged in user
    let sql = "SELECT * FROM SalesItems WHERE pid = ? AND seller = ?";

    db.query(sql, [productId, seller], (err, result) => {
        if (err) {
            res.render('error');
        }

        if (result.length > 0) {
            
            // Update a sales item's status to 'Ended'
            sql = "UPDATE SalesItems SET status = 4 WHERE pid = ?";

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

    // Retrieve information of a sales item that is being sold by the logged in user
    let sql = "SELECT * FROM SalesItems WHERE pid = ? AND seller = ?";

    db.query(sql, [productId, seller], (err, result) => {
        if (err) {
            res.render('error');
        }

        if (result.length > 0) {

            // Update a sales item's status to 'Unapproved'
            sql = "UPDATE SalesItems SET status = 1 WHERE pid = ?";

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