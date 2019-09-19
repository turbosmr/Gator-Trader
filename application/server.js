const express = require('express');
const http = require('http');
const path = require('path');
const exphbs = require('express-handlebars');

const app = express();
const server = http.Server(app);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index.js'));

// Set port number
app.set('port', 3000);

// Start server
server.listen(app.get('port'), function () {
    console.log('Starting server on port ' + app.get('port'));
});

module.exports = app;