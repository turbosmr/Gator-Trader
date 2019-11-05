const db = require('../config/db');

// Display registered user's dashboard page 
exports.index = (req, res, next) => {
    // Render active listings
    if (req.user) {
        let product = [];
        let sql = "SELECT SalesItem.name, SalesItem.status, Category.name AS category, SalesItem.price FROM SalesItem INNER JOIN Category ON SalesItem.category = Category.cid WHERE seller = ? AND status != 'unapproved'";
        let placeholders = [req.user.sid];
        
        db.query(sql, placeholders, (error, result) => {
            if (error) throw error;

            for (let i = 0; i < result.length; i++) {
                 product.push(result[i]);
            }
            
            res.render('dashboard', { product: product });
        });
    }
    else {
        res.render('dashboard');
    }
}