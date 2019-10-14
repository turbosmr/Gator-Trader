//file used for methods that pertain to the creation of sample data

//imports database for use
var db = require('../auth/db_config.js');

var createItem = function(name) {
    let sql = "INSERT INTO SalesItems (productId, productName, sellerId) VALUES (?,?,?)";
    db.query(sql,[createId(),name, '911689186'], function(err, result){
        if(err) {
            console.log("Error retriving userid: " + err);
            return false;
        } else {
            console.log("Data created.");
        }
    });
}

var createId = function() {
    let id = "";
    for (let i = 0; i < 20; i++) {
        id += Math.floor(Math.random() * 10);
    }
    return id;
}

for (var i = 0; i < 10; i++) {
    createItem("name" + i);
}