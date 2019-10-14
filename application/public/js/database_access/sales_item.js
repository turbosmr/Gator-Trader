//file used for methods that pertain to sale items

//imports database for use
var db = require('../auth/db_config.js');

var newSaleItem = function () {
    return 0;
} 

var getSaleItems = function () {
    let sql = "SELECT * FROM SalesItems";
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        return result;
    });
}

var percentLikeTest = function (term, callback) {
    let sql = "SELECT * FROM SalesItems WHERE productName LIKE ? OR description LIKE ?";
    db.query(sql,['%'+term +'%','%'+ term +'%'], (err, result) => {
        if (err){ 
            //console.log(err);
            callback(err, null);
        }
        //console.log(result);
        callback(null,result);
    });
}

percentLikeTest("name", (err, result) => {
    if (err){ 
        console.log(err);
    }
    console.log(result);
});
