const express = require('express');
const http = require('http');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require("express-session");
const flash = require('connect-flash');
const categories = require('./controllers/categoriesController');

const app = express();
const server = http.Server(app);

app.use(express.static("public"));

app.use(session({
    secret: "cats",
    resave: true,
    saveUninitialized: false
}));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
    app.locals.loggedInUser = req.user;
    app.locals.success = req.flash('success');
    app.locals.error = req.flash('error');
    app.locals.category = categories.retrieve();
    next();
});

// Handlebars
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: require('./config/handlebars-helpers')
}));
app.set('view engine', 'hbs');

// Routes
app.use('/', require('./routes/index'));
app.use('/about', require('./routes/about'));
app.use('/users', require('./routes/users'));
app.use('/search', require('./routes/search'));
app.use('/products', require('./routes/products'));
app.use('/dashboard', require('./routes/registeredUserDashboard'));
app.use('/admin', require('./routes/administratorDashboard'));

// Set port number
app.set('port', 3000);

// Start server
server.listen(app.get('port'), function () {
    console.log('Starting server on port ' + app.get('port'));
});

// Limit max concurrent connections to 50 (non-functional requirement)
server.maxConnections = 50;

module.exports = app;