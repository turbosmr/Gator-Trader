const db = require('../config/db');
const uuidv1 = require('uuid/v1');

// Handle showing sell page on GET
exports.sell_get = (req, res, next) => {

    // Retrieve information of all courses
    let sql = "SELECT * FROM Courses";

    let course = [];

    db.query(sql, (err, result) => {
        if (err) {
            res.render('error');
        }

        for (let i = 0; i < result.length; i++) {
            course.push(result[i]);
        }

        res.render('sell', {
            course: course
        });
    });
}

// Handle submitting sales item for sell on POST
exports.sell_post = (req, res, next) => {
    let productId = uuidv1();
    let { productName, price, category, classMaterialSection, condition, quantity, deliveryMethod, description } = req.body;
    let seller = req.user.sid;
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

    // Intepret and store newline for description
    description = description.replace(/\r\n|\r|\n/g, "<br>");

    // Check if class material section field is empty
    if (classMaterialSection != '') {

        // Create a new sales item
        sql += "INSERT INTO SalesItems (pid, seller, category, name, price, `condition`, quantity, description, deliveryMethod, classMaterialSection) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

        salesItemPlaceholders = [productId, seller, category, productName, price, condition, quantity, description, deliveryMethod, classMaterialSection];
        placeholders.push(...salesItemPlaceholders);
    }
    else {

        // Create a new sales item
        sql += "INSERT INTO SalesItems (pid, seller, category, name, price, `condition`, quantity, description, deliveryMethod, classMaterialSection) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL);";

        salesItemPlaceholders = [productId, seller, category, productName, price, condition, quantity, description, deliveryMethod];
        placeholders.push(...salesItemPlaceholders);
    }

    // Store pickup location in DB
    // Pickup only (multiple locations) or shipping & pickup
    if (Array.isArray(tempDeliveryMethod)) {

        for (let i = 0; i < tempDeliveryMethod.length; i++) {

            // Make sure "shipping" is not included as a location
            if (tempDeliveryMethod[i] != "shipping") {

                // Create a new pickup location for a sales item
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
    else {

        // Make sure "shipping" is not included as a location
        if (tempDeliveryMethod != "shipping") {

            // Create a new pickup location for a sales item
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
    }

    // Save filename of uploaded sales item photo(s)
    for (let i = 0; i < salesItemImages.length; i++) {

        // Create a new sales item photos (filename) for a sales item
        sql += "INSERT INTO SalesItemPhotos (product, fileName) VALUES (?, ?);";
        placeholders.push(productId);
        placeholders.push(salesItemImages[i].filename);
    }

    db.query(sql, placeholders, (err, result) => {
        if (err) {
            req.flash('error', 'Error listing item');
            res.render('sell');
        }

        if ((typeof result !== 'undefined')) {
            req.flash('success', 'Successfully listed item for sale');
            res.redirect('/user/dashboard');
        }
        else {
            req.flash('error', 'Error listing item');
            res.redirect('/sell');
        }
    });
}