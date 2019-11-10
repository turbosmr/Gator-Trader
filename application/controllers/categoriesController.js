
const db = require('../config/db');
let category = [];
let sql = "SELECT * FROM Category";

db.query(sql, (err, result) => {
    if (err) throw err;
    
    for (let i = 0; i < result.length; i++) {
        category.push(result[i]);
    }
});

exports.retrieve = category;