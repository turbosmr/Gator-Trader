const db = require('../config/db');
let category = [];

// Retrieve information of all sales item categories
let sql = "SELECT * FROM Categories";

db.query(sql, (err, result) => {
    if (err) throw err;
    
    for (let i = 0; i < result.length; i++) {
        category.push(result[i]);
    }
});

exports.retrieve = category;