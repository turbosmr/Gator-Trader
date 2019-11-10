
const db = require('../config/db');
let category = [];
let sql = "SELECT * FROM Category";

db.query(sql, (err, rows) => {
    if (err) throw err;
    
    for (let i = 0; i < rows.length; i++) {
        category.push(rows[i]);
    }
});

exports.retrieve = category;