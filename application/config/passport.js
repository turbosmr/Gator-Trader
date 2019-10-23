const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('./db');

module.exports = () => {
    passport.use('local-login', new LocalStrategy(
        (username, password, done) => {
            db.query("SELECT * FROM RegisteredUser WHERE email = ? LIMIT 1", username, (error, result) => {
                if (error) return done(error);
                if (result.length == 0) {
                    return done(null, false, { message: 'Username and/or password is incorrect' });
                }
                // Match password
                bcrypt.compare(password, result[0].password, (error, isMatch) => {
                    if (error) throw error;
                    if (isMatch) {
                        return done(null, result[0]);
                    }
                    else {
                        return done(null, false, { message: 'Username and/or password is incorrect' });
                    }
                });
            });
        }
    ));

    passport.serializeUser((user, done) => {
        return done(null, user.sid);
    });

    passport.deserializeUser((id, done) => {
        db.query("SELECT * FROM RegisteredUser WHERE sid = ?", id, (error, result) => {
            if (error) throw error;
            return done(null, result[0]);
        });
    });
};