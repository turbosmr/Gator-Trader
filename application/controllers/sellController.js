const db = require('../config/db');
const uuidv1 = require('uuid/v1');

// Handle showing sell page on GET
exports.sell_get = (req, res, next) => {
    let sql = "SELECT * FROM ClassSection";
    let classSection = [];

    db.query(sql, (err, result) => {
        if (err) throw err;

        for (let i = 0; i < result.length; i++) {
            classSection.push(result[i]);
        }

        res.render('sell', {
            classSection: classSection
        });
    });
}

// Handle submitting sales item for sell on POST
exports.sell_post = (req, res, next) => {
    let UUID = uuidv1();
    let { productName, price, category, classMaterialSection, condition, quantity, deliveryMethod, description } = req.body;
    let seller = req.user.sid;
    let salesItemImages = req.files;
    let sql = "";
    let placeholders = [];
    let tempDeliveryMethod = deliveryMethod;

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
        // Store pickup location in DB
        /*for (let i = 0; i < tempDeliveryMethod.length; i++) {
            if (tempDeliveryMethod[i] != "shipping") {
                sql += "INSERT INTO PickupLocation (product, location) VALUES (?, ?);";
                placeholders.push(UUID);
                placeholders.push(tempDeliveryMethod[i]);
            }
        }*/
    }
    else {
        // Shipping only
        if (tempDeliveryMethod == "shipping") {
            deliveryMethod = 1;
        }
        // Pickup only (single location)
        else {
            deliveryMethod = 2;
            /*sql += "INSERT INTO PickupLocation (product, location) VALUES (?, ?);";
            placeholders.push(UUID);
            placeholders.push(tempDeliveryMethod);*/
        }
    }

    if (classMaterialSection != '') {
        sql += "INSERT INTO SalesItem (pid, seller, category, name, price, `condition`, quantity, description, deliveryMethod, classMaterialSection) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        placeholders = [UUID, seller, category, productName, price, condition, quantity, description, deliveryMethod, classMaterialSection];
    }
    else {
        sql += "INSERT INTO SalesItem (pid, seller, category, name, price, `condition`, quantity, description, deliveryMethod, classMaterialSection) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL);";
        placeholders = [UUID, seller, category, productName, price, condition, quantity, description, deliveryMethod];
    }

    for (let i = 0; i < salesItemImages.length; i++) {
        sql += "INSERT INTO SalesItemPhoto (product, fileName) VALUES (?, ?);";
        placeholders.push(UUID);
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