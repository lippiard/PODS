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
app.get('/test', routes.get_test);
//app.post('/processchoice', routes.process_choice);
app.get('/results', routes.get_results);
app.get('/login', routes.get_login);
app.post('/checklogin', routes.post_check_login);
app.get('/profile', routes.get_profile);
app.get('/create', routes.get_create);
app.get('/pod', routes.get_pod);
//app.get('/getsessions', routes.get_sessions);
//app.get('/main', routes.get_main);
app.post('/postchoice', routes.post_choice);
app.get('/data', routes.get_data);
app.post('/createsession', routes.post_create_session);
app.get('/signup', routes.get_signup);
app.post('/createaccount', routes.post_create_account);
app.post('/joinsession', routes.post_join_session);
app.post('/postchoices', routes.post_choices);
app.post('/joindatasession', routes.post_data_sid);
app.post('/fetchresults', routes.post_fetch_results);
app.post('/leavesession', routes.post_leave_session);
app.post('/fetchsessiondetails', routes.post_fetch_session_details);
app.post('/passcheck', routes.check_password);

var queue = []; //list of sockets waiting to be matched

//add socket to queue or pair with socket already in queue
var pairSockets = function(socket, sid, username) {
	var waiting = queue.find(function(el) {
		if (el.sessionID === sid) {
			return el;
		}
	});
	if (waiting) {
		//remove waiting from queue
		queue = queue.filter(item => !((item.socket.id === waiting.socket.id) && (sid === item.sessionID)));
		
		var waitingSocket = waiting.socket;
		var room = sid+'#'+waitingSocket.id+'#'+socket.id; //name rooms as sessionID#socket1#socket2
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
		waitingSocket.emit('start game', {role: role1, room: room, choices: {round1: 0, round2: 0, round3: 0, round4: 0}});
		socket.emit('start game', {role: role2, room: room, choices: {round1: 0, round2: 0, round3: 0, round4: 0}});
	} else {
		queue.push({socket: socket, sessionID: sid});
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
		socket.to(data.room).emit('your turn', data);
	});
	
	socket.on('last round played', function(data) {
		socket.to(data.room).emit('end game', data);
	});
	
	socket.on('leave queue', function(data) {
		if (queue.length > 0) {
			queue = queue.filter(item => !((item.socket.id === socket.id) && (data.sid === item.sessionID)));
		}
	});
	
	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
	
});

var port = 8080; //use for running on local machine
//var port = 5000; // use for running through http online

http.listen(port, function() {
	console.log('listening on port '+port);
});

//app.listen(8080);
//console.log('Server running on port 8080. Go to http://localhost:8080/')
