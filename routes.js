/**
 * 
 */
var sd = require('./simuldecision.js');
var ejs = require('ejs');
var fs = require('fs');
var SHA3 = require('crypto-js/sha3');
var db = require('./database/database.js')

//var fileName = '../git/HideAndSeekJson/data.json';
var fileName = './HideAndSeekJson/data.json';
var file = require(fileName);

var choices = {round1: 0, round2: 0, round3: 0, round4: 0, accesscounter: 0};

var getLogin = function(req, res) {
	if (!req.session.loggedIn) {
		res.render('login.ejs');
	} else {
		res.redirect('/');
	}
};

var postCheckLogin = function(req, res) {
	req.session.loggedIn = false;
	userInput = req.body.usernameInput;
	passInput = req.body.passwordInput;
	if (userInput && passInput) {
		
		db.get_user(userInput, function(err, u) {
			if (err || !u) {
				res.redirect('/login?err=1');
			} else {
				if (SHA3(passInput).toString() === u.password) {
					req.session.loggedIn = true;
					req.session.userID = u.userID;
					res.redirect('/');
				} else {
					res.redirect('/login?err=1');
				}
			}
		});
	} else {
		res.redirect('/login');
	}
	//res.redirect('/');
};

var getHome = function(req, res) {
	//redirect to login if not logged in
	if (!req.session.loggedIn) {
		res.redirect('/login');
	} else {
		//get all game sessions from database, send array to home.ejs
		db.get_sessions(function(err, data) {
			req.session.round = 1;
			res.render('home.ejs', {sessions: data});
		});
	}
};

var getProfile = function (req, res) {
	if (!req.session.loggedIn) {
		res.redirect('/login');
	} else {
		//get all game sessions with this user as creator
		db.get_creator_sessions(req.session.userID, function(err, rs) {
			if (err || !rs) {
				res.render('profile.ejs', {sessions: []});
			} else {
				res.render('profile.ejs', {sessions: rs});
			}
		});
		//res.render('profile.ejs', {sessions: sessions});
	}
};

var getCreate = function(req, res) {
	if (!req.session.loggedIn) {
		res.redirect('/login');
	} else {
		res.render('create.ejs');
	}
};

var getPod = function(req, res) {
	console.log("getting pod");
	//get sid of clicked on gamesession
	//keep track of sid in session variable
	if (req.query.sid) {
		req.session.currentSID = req.query.sid;
		res.redirect('/pod');
	} else if (req.session.round) {
		console.log(req.session.round);
		var round = req.session.round;
		var game = null;
		var player = null;
		var page = 'main';
		if (round == 1 || round == null) {
			choices.round1 = 0;
			choices.round2 = 0;
			choices.round3 = 0;
			choices.round4 = 0;
			game = "Evade";
			player = "Hider";
			req.session.round = 1;
		} else if (round == 2) {
			game = "Evade";
			player = "Seeker";
			req.session.round = 2;
		} else if (round == 3) {
			game = "Find";
			player = "Hider";
			req.session.round = 3;
		} else if (round == 4) {
			game = "Find";
			player = "Seeker";
			req.session.round = 4;
		} else if (round == 5) {
			page = 'results';
			
			file.evadeHiderCount[choices.round1-1] = file.evadeHiderCount[choices.round1-1] + 1;
			file.evadeSeekerCount[choices.round2-1] = file.evadeSeekerCount[choices.round2-1] + 1;
			file.findHiderCount[choices.round3-1] = file.findHiderCount[choices.round3-1] + 1;
			file.findSeekerCount[choices.round3-1] = file.findSeekerCount[choices.round3-1] + 1;
			
			if (choices.round1 == choices.round2) {
				file.evadeSeekerScore[choices.round2-1] = file.evadeSeekerScore[choices.round2-1] +1;
			} else {
				file.evadeHiderScore[choices.round1-1] = file.evadeHiderScore[choices.round1-1] +1;
			}
			
			if (choices.round3 == choices.round4) {
				file.findSeekerScore[choices.round3-1] = file.evadeSeekerScore[choices.round3-1] +1;
				file.findHiderScore[choices.round3-1] = file.evadeHiderScore[choices.round3-1] +1;
			} 
			
			file.totalGamesPlayed = file.totalGamesPlayed + 1;
			
			fs.writeFile(fileName, JSON.stringify(file), function (err) {
			  if (err) return console.log(err);
			  console.log(JSON.stringify(file));
			  console.log('writing to ' + fileName);
			});
		}
		res.render('pod.ejs', {sid: req.session.currentSID, 
			game: game, player: player, page: page, choices: choices});
	} else {
		req.session.round = 1;
		res.redirect('/pod');
	}
};

var getSessions = function(req, res) {
	sessions = [
		["1", {"type": "Hide and Seek", "private": "Yes", "creator": "Steve"}],
		["2", {"type": "Evacuation", "private": "No", "creator": "Steve"}]
	];
	res.send(JSON.stringify({sessions: sessions}));
};

var getMain = function(req, res) {
	if (!req.session.loggedIn) {
		res.redirect('/login');
	} else {
		var round = req.session.round;
		var game = null;
		var player = null;
		if (round == 1 || round == null) {
			choices.round1 = 0;
			choices.round2 = 0;
			choices.round3 = 0;
			choices.round4 = 0;
			game = "Evade";
			player = "Hider";
			req.session.round = 1;
		} else if (round == 2) {
			game = "Evade";
			player = "Seeker";
			req.session.round = 2;
		} else if (round == 3) {
			game = "Find";
			player = "Hider";
			req.session.round = 3;
		} else if (round == 4) {
			game = "Find";
			player = "Seeker";
			req.session.round = 4;
		}
		res.render('main.ejs', {game: game, player: player});
	}
};
	
var processChoice = function(req, res) {
	var thischoice = req.body.choice;
	var round = req.session.round;
	if (round == 1 || round == null) {
		choices['round'+round] = thischoice;
		req.session.round = 2;
		res.redirect("/pod");
	} else if (round == 2) {
		req.session.round = 3;
		choices['round'+round] = thischoice;
		res.redirect("/pod");
	} else if (round == 3) {
		req.session.round = 4; 
		choices['round'+round] = thischoice;
		res.redirect("/pod");
	} else if (round == 4) {
		req.session.round = 5;
		choices['round'+round] = thischoice;
		res.redirect("/pod");
	} else {
		res.redirect("/");
	}
};

var postChoice = function(req, res) {
	var round = req.body.round;
	if (round == 5) {
		res.send({choices:choices});
		choices.accesscounter++;
		if (choices.accesscounter >= 2) {
			writeAndResetChoices();
		}
	} else {
		var choice = req.body.choice;
		choices["round"+round] = choice;
	}
};

function writeAndResetChoices() {
	file.evadeHiderCount[choices.round1-1] = file.evadeHiderCount[choices.round1-1] + 1;
	file.evadeSeekerCount[choices.round2-1] = file.evadeSeekerCount[choices.round2-1] + 1;
	file.findHiderCount[choices.round3-1] = file.findHiderCount[choices.round3-1] + 1;
	file.findSeekerCount[choices.round3-1] = file.findSeekerCount[choices.round3-1] + 1;
	
	if (choices.round1 == choices.round2) {
		file.evadeSeekerScore[choices.round2-1] = file.evadeSeekerScore[choices.round2-1] +1;
	} else {
		file.evadeHiderScore[choices.round1-1] = file.evadeHiderScore[choices.round1-1] +1;
	}
	
	if (choices.round3 == choices.round4) {
		file.findSeekerScore[choices.round3-1] = file.evadeSeekerScore[choices.round3-1] +1;
		file.findHiderScore[choices.round3-1] = file.evadeHiderScore[choices.round3-1] +1;
	} 
	
	file.totalGamesPlayed = file.totalGamesPlayed + 1;
	
	fs.writeFile(fileName, JSON.stringify(file), function (err) {
	  if (err) return console.log(err);
	  console.log(JSON.stringify(file));
	  console.log('writing to ' + fileName);
	});
	
	choices.round1 = 0;
	choices.round2 = 0;
	choices.round3 = 0;
	choices.round4 = 0;
	choices.accesscounter = 0;
}

var getResults = function(req, res) {
//	var evadePayoffs = sd.get_payoffs('./HideAndSeekJson/evade.json', 
//			choices.round1, choices.round2);
//	var findPayoffs = sd.get_payoffs('./HideAndSeekJson/find.json',
//			choices.round3, choices.round4);
//	var evadeWinner;
//	if (evadePayoffs[0] == 1) {
//		evadeWinner = "Hider";
//	} else if (evadePayoffs[1] == 1) {
//		evadeWinner = "Seeker";
//	}
//	var findWinLoss;
//	if (findPayoffs[1] == 1) {
//		findWinLoss = 'win';
//	} else {
//		findWinLoss = 'lose';
//	}
	
	//above is not used right now
	res.render('results.ejs', choices);
	
};

var getData = function(req, res) {
	if (!req.session.loggedIn) {
		res.redirect('/login');
	} else {
		res.render('data.ejs', {plots: ["//plot.ly/~team19/190.embed", "//plot.ly/~team19/188.embed",
			"//plot.ly/~team19/189.embed", "//plot.ly/~team19/194.embed"]}); 
	}
};

var postCreateSession = function(req, res) {
	
};


var routes = {
	get_main: getMain,
	process_choice: processChoice,
	get_results: getResults,
	get_login: getLogin,
	post_check_login: postCheckLogin,
	get_home: getHome,
	get_profile: getProfile,
	get_create: getCreate,
	get_pod: getPod,
	get_sessions: getSessions,
	post_choice: postChoice,
	get_data: getData,
	post_create_session: postCreateSession
};

module.exports = routes;