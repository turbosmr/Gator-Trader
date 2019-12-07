const db = require('../config/db');

// Handle showing contact seller page on GET
exports.get = (req, res, next) => {
    let productId = req.params.pid;
    let inquiryId = req.query.id;
    let loggedInUser = req.user.sid;
    let messages = [];
    let sql = "";
    let placeholders = [];

    // Check if ".../inquiry?id=[inquiryId]" exist
    if (typeof inquiryId !== "undefined") {

        // Retrieve information of the sales item that is being inquired, cast sales item price to CHAR to show leading zeros in view page, and include the seller email
        sql = "SELECT SI.*, CAST(SI.price AS CHAR) AS price, S.username AS sellerEmail FROM SalesItems SI INNER JOIN Students S on SI.seller = S.sid WHERE SI.pid = ?;"
        
        // Retrieve all sales item photos (filename) specific to the sales item that is being inquired
        sql += "SELECT fileName as photoFileName FROM SalesItemPhotos WHERE product = ?;";
        
        // Retrieve inquiry information of the sales item that is being inquired only if the user that is logged in is either the seller of the sales item or the inquirer. Also, include all messages that belong to the inquiry, the seller email, and the message sender's email. Also, sort messages by the time it was sent in ascending order.
        sql += "SELECT S2.sid AS senderSid, S2.username AS senderEmail, I.subject AS subject, M.message AS message, DATE_FORMAT(convert_tz(M.time,@@session.time_zone,'-08:00'), '%m-%d-%Y %h:%i %p') AS time FROM Inquiries I INNER JOIN Messages M on I.iid = M.inquiry INNER JOIN SalesItems SI on I.product = SI.pid INNER JOIN Students S on SI.seller = S.sid INNER JOIN Students S2 on M.from = S2.sid WHERE I.iid = ? AND I.product = ? AND (I.inquirer = ? OR SI.seller = ?) ORDER BY time ASC;";
        
        // Retrieve all pick up locations specific to the sales item that is being inquired
        sql += "SELECT * FROM PickupLocations WHERE product = ?;"

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

                    res.render('inquiry', {
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

        // Retrieve information of the sales item that is being inquired, cast sales item price to CHAR to show leading zeros in view page, and include the seller email
        sql = "SELECT SI.*, CAST(SI.price AS CHAR) AS price, S.username AS sellerEmail FROM SalesItems SI INNER JOIN Students S on SI.seller = S.sid WHERE SI.pid = ?;";

        // Retrieve all sales item photos (filename) specific to the sales item that is being inquired
        sql += "SELECT fileName as photoFileName FROM SalesItemPhotos WHERE product = ?;";
        
        // Retrieve inquiry information of the sales item that is being inquired by the user that is logged in
        sql += "SELECT * FROM Inquiries I WHERE I.product = ? AND I.inquirer = ?;";

        // Retrieve all pick up locations specific to the sales item that is being inquired
        sql += "SELECT * FROM PickupLocations WHERE product = ?;"

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
                        res.render('inquiry', {
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
exports.post = (req, res, next) => {
    let productId = req.params.pid;
    let inquiryId = req.query.id;
    let sender = req.user.sid;
    let { subject, message } = req.body;
    let sql = "";
    let placeholders = [];

    // Check if message is empty
    if (message !== "") {
        if (typeof inquiryId !== "undefined") {

            // Store a new message that includes inquiry id, the student id of sender, and the message
            sql += "INSERT INTO Messages (inquiry, `from`, message) VALUES (?, ?, ?);";

            placeholders = [inquiryId, sender, message];
        }
        else {

            // Store a new inquiry that includes product id, the student id of inquirer, and the subject
            sql = "INSERT INTO Inquiries (product, inquirer, subject) VALUES (?, ?, ?);"
            
            placeholders = [productId, sender, subject];
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

                    // Create a new message that includes inquiry id, the student id of sender, and the message
                    sql = "INSERT INTO Messages (inquiry, `from`, message) VALUES (?, ?, ?);";

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
    }
    else {
        res.redirect('/products/' + productId + '/inquiry?id=' + inquiryId);
    }
}