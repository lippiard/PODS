/**
 * 
 */

var express = require('express');
var routes = require('./routes.js');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session')

app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
app.use(bodyParser.text({ type: 'text/html' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({
    keys: ['secret1', 'secret2']
}));


app.get('/', routes.get_main);
app.post('/processchoice', routes.process_choice);
app.get('/results', routes.get_results);

app.listen(8080);
//http.createServer(app).listen(8080);
console.log('Server running on port 8080. Go to http://localhost:8080/')
