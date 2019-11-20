const db = require('../config/db');

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
    let { productName, price, category, classMaterialSection, condition, quantity, deliveryMethod, description } = req.body;
    let seller = req.user.sid;
    let salesItemImageFileName = req.file.filename;
    let sql = "";
    let placeholders = [];

    if (classMaterialSection != '') {
        sql = "INSERT INTO SalesItem (pid, seller, category, name, price, `condition`, quantity, description, deliveryMethod, photoFileName, classMaterialSection) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        placeholders = [seller, category, productName, price, condition, quantity, description, deliveryMethod, salesItemImageFileName, classMaterialSection];
    }
    else {
        sql = "INSERT INTO SalesItem (pid, seller, category, name, price, `condition`, quantity, description, deliveryMethod, photoFileName, classMaterialSection) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)";
        placeholders = [seller, category, productName, price, condition, quantity, description, deliveryMethod, salesItemImageFileName];
    }

    db.query(sql, placeholders, (err, result) => {
        if (err) {
            req.flash('error', 'Error listing item');
            res.render('sell');
        }

        if (result.affectedRows > 0) {
            req.flash('success', 'Successfully listed item for sale');
            res.redirect('/user/dashboard');
        }
        else {
            req.flash('error', 'Error listing item');
            res.render('sell');
        }
    });
}