/**
 * 
 */

var express = require('express');
var routes = require('./routes.js');
var app = express();
var bodyParser = require('body-parser');
//var cookieParser = require('cookie-parser');
//var cookieSession = require('cookie-session')
var session = require('express-session')

app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
app.use(bodyParser.text({ type: 'text/html' }));
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(cookieParser());
//app.use(cookieSession({
//    keys: ['secret1', 'secret2']
//}));
app.use(express.static(__dirname + '/img/')); // for getting images from local files
app.use(express.static(__dirname + '/views/')); // for loading ejs parts into other ejs
app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false,
	cookie: {secure: false},
}));


//app.get('/', routes.get_main);
app.get('/', routes.get_home);
app.post('/processchoice', routes.process_choice);
app.get('/results', routes.get_results);
app.get('/login', routes.get_login);
app.post('/checklogin', routes.post_check_login);

app.listen(8080);
console.log('Server running on port 8080. Go to http://localhost:8080/')
