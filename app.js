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
app.post('/postchoice', routes.post_choice);
app.get('/data', routes.get_data);


var queue = []; //list of sockets waiting to be matched

//add socket to queue or pair with socket already in queue
var pairSockets = function(socket, sid, username) {
	if (queue.length > 0) {
		var waitingSocket = queue.pop();
		var room = sid+'#'+waitingSocket.id+'#'+socket.id;
		waitingSocket.join(room);
		socket.join(room);
		var rnd = Math.random();
		var role1;
		var role2;
		if (rnd < 0.5) {
			role1 = 'Hider';
			role2 = 'Seeker';
		} else {
			role1 = 'Seeker';
			role2 = 'Hider';
		}
		waitingSocket.emit('start game', {role: role1, room: room});
		socket.emit('start game', {role: role2, room: room});
	} else {
		queue.push(socket);
	}
};

io.on('connection', function(socket) {
	console.log('user '+socket.id+' connected');
	
	socket.on('join session chat room', function (data) {
		socket.join(data.sid);
	});
	
	socket.on('find game room', function(data) {
		pairSockets(socket, data.sid, data.username);
	});
	
	socket.on('made choice', function(data) {
		socket.to(data.room).emit('your turn');
	});
	
	socket.on('last round played', function(data) {
		socket.to(data.room).emit('end game');
	});
	
});

http.listen(8080, function() {
	console.log('listening on port 8080');
});

//app.listen(8080);
//console.log('Server running on port 8080. Go to http://localhost:8080/')
