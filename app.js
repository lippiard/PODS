/**
 * 
 */

var express = require('express');
var routes = require('./routes.js')
var app = express();


app.get('/', routes.get_main);

app.listen(8080);
console.log('Server running on port 8080. Go to http://localhost:8080/')
