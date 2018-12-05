/**
 * 
 */

var express = require('express');
var routes = require('./routes.js');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session')
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
app.use(bodyParser.text({ type: 'text/html' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/img/')); // for getting images from local files
app.use(express.static(__dirname + '/views/')); // for loading ejs parts into other ejs
app.use(express.static(__dirname + '/node_modules/ejs/')); //for importing ejs into html dynamically
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
app.get('/profile', routes.get_profile);
app.get('/create', routes.get_create);
app.get('/pod', routes.get_pod);
app.get('/getsessions', routes.get_sessions);
app.get('/main', routes.get_main);

io.on('connection', function(socket) {
	console.log('a user connected');
});

http.listen(8080, function() {
	console.log('listening on port 8080');
});

//app.listen(8080);
//console.log('Server running on port 8080. Go to http://localhost:8080/')
