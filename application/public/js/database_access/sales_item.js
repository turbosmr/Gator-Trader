//file used for methods that pertain to sale items

//imports database for use
var db = require('../auth/db_config.js');
db.connect();

var newSaleItem = function () {
    return 0;
} 

exports.getSaleItems = function (callback) {
    let sql = "SELECT * FROM SalesItems";
    db.query(sql, (err, result) => {
        if (err){
            callback(err,null)
        }
        callback(null, result);
    });
}

exports.percentLikeResults = function (term, callback) {
    let sql = "SELECT * FROM SalesItems WHERE productName LIKE ? OR description LIKE ?";
    db.query(sql,['%'+term +'%','%'+ term +'%'], (err, result) => {
        if (err){ 
            callback(err, null);
        }
        callback(null,result);
    });
}

