const express = require('express');
const http = require('http');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const app = express();
const server = http.Server(app);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: false}));

// Routes
app.use('/', require('./routes/index.js'));
app.use('/about', require('./routes/about.js'));
app.use('/search', require('./routes/search.js'));

// Set port number
app.set('port', 3000);

// Start server
server.listen(app.get('port'), function () {
    console.log('Starting server on port ' + app.get('port'));
});

module.exports = app;