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
app.use(express.static(__dirname + '/gamedata/'));
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
var pairSockets = function(socket, sid) {
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


var numPerEvac = 4;
var numPerECF = 5; //max 5

var groupSockets = function(socket, sid, game) {
	var n;
	if (game === 'Evacuation') {
		n = numPerEvac;
	} else if (game === 'EnterpriseCrowdFunding') {
		n = numPerECF;
	}
	var waiting = [];
	for (var i = 0; i < n - 1; i++) {
		var waitingOne = queue.find(function(el) {
			if (el.sessionID === sid) {
				return el;
			}
		});
		if (waitingOne) {
			waiting.push(waitingOne);
		}
		queue = queue.filter(item => !((item.socket.id === waitingOne.socket.id) && (sid === item.sessionID)));
	}
	if (waiting.length == n - 1) {
		var room = sid+'#'+socket.id;
		//remove waiting from queue
		for (var i = 0; i < waiting.length; i++) {
		  queue = queue.filter(item => !((item.socket.id === waiting[i].socket.id) && (sid === item.sessionID)));
		  sid += '#'+waiting[i].socket.id;
		}
		
		var roles = [];
		if (game === 'Evacuation') {
			roles.push("Timer");
			for (var i = 0; i < waiting.length; i++) {
				roles.push(null);
			}
		} else if (game === "EnterpriseCrowdFunding") {
			for (var i = 0; i < n; i++) {
				var r  = i + 1;
				roles.push("player"+r);
			}
		}
		
		socket.join(room);
		socket.emit('start game', {room: room, role: roles[0], numplayers: n});
		
		for (var i = 0; i < waiting.length; i++) {
			waiting[i].socket.join(room);
			waiting[i].socket.emit('start game', {room: room, role: roles[i+1], numplayers: n});
		}
	
	} else {
		for (var i = 0; i < waiting.length; i++) {
			queue.push({socket: waiting[i].socket, sessionID: sid});
		}
		queue.push({socket: socket, sessionID: sid});
	}
};

function evacWarningLevel(currentLevel) {
	var r = Math.random();
    if (r < 0.15) {
      currentLevel = currentLevel - 1;
    } else if (r < .3 ){
      currentLevel = currentLevel + 1;
    }
    if (currentLevel < 0) {
      currentLevel = 0;
    } else if (currentLevel > 5) {
      currentLevel = 5;
    }
    return currentLevel;
};

io.on('connection', function(socket) {
	console.log('user '+socket.id+' connected');
	
	socket.on('join session chat room', function (data) {
		socket.join(data.sid);
	});
	
	socket.on('find game room', function(data) {
		if (data.gametype === "HideAndSeek") {
			pairSockets(socket, data.sid);
		} else if (data.gametype === "Evacuation" || data.gametype === "EnterpriseCrowdFunding") {
			groupSockets(socket, data.sid, data.gametype);
		} 
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
	
	socket.on('evac tick', function(data) {
		io.in(data.room).emit('update warning level', {warningLevel: evacWarningLevel(data.warningLevel)});
	});
	
	socket.on('evaced', function(data) {
		socket.to(data.room).emit('increment evaced', data);
	});
	
	socket.on('chose allo', function(data) {
		socket.to(data.room).emit('allo chosen', data);
	})
});

//var port = 8080; //use for running on local machine
var port = 5000; // use for running through http online

http.listen(port, function() {
	console.log('listening on port '+port);
});

//app.listen(8080);
//console.log('Server running on port 8080. Go to http://localhost:8080/')
