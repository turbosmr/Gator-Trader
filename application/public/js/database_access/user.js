//file used for methods that pertain to users

//imports database for use
var db = require('../auth/db_config.js');

var createUser = function (email, password) {
    if (!emailValidation(email)) {
        return false;
    }
    let pass = passwordProtection(password);
    //let sql = "INSERT INTO users"
}

//makes sure email is a valid SFSU email
var emailValidation = function (email) {
    return email.includes("@mail.sfsu.edu");
}

//takes in a password and encrypts it 
var passwordProtection = function (pass) {
    let prote = [];
    prote.length = pass.length * 2;
    for (let i = 0; i < pass.length; i++) {
        prote[i] = String.fromCharCode(pass.charCodeAt(i) + 1);
        prote[prote.length - 1 - i] = String.fromCharCode(pass.charCodeAt(i) - 1);
    }
    return prote.toString().replace(/,/g, "");
}