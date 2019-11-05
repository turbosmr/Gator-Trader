
const db = require('../config/db');
let category = [];

exports.retrieve = () => {
    let sql = "SELECT * FROM Category";

    db.query(sql, (error, rows) => {
        if (error) throw error;
        for (let i = 0; i < rows.length; i++) {
            category.push(rows[i]);
        }
    });
    
    return category;
}