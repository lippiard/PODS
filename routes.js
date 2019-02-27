/**
 * 
 */
var sd = require('./simuldecision.js');
var ejs = require('ejs');
var fs = require('fs');
var SHA3 = require('crypto-js/sha3');
var db = require('./database/database.js')

var fileName = './HideAndSeekJson/data.json';
var file = require(fileName);

var choices = {round1: 0, round2: 0, round3: 0, round4: 0, accesscounter: 0};

var getLogin = function(req, res) {
	var err = req.query.err;
	var message;
	if (err == 1) {
		message = 'Incorrect username or password. Please try again.';
	}
	if (!req.session.loggedIn) {
		res.render('login.ejs', {message: message});
	} else {
		res.redirect('/');
	}
};

var getSignup = function(req, res) {
	var err = req.query.err;
	var messages = {1: 'All fields are required.', 2: 'Passwords did not match.', 
			3: 'An account with this email already exists'};
	var message;
	message = messages[err];
	if (!req.session.loggedIn) {
		res.render('signup.ejs', {message: message});
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
					req.session.userNick = u.nickname;
					res.redirect('/');
				} else {
					res.redirect('/login?err=1');
				}
			}
		});
	} else {
		res.redirect('/login?err=1');
	}
	//res.redirect('/');
};

var postCreateAccount = function(req, res) {
	userInput = req.body.usernameInput;
	passInput1 = req.body.passwordInput;
	passInput2 = req.body.verifyPasswordInput;
	nickInput = req.body.nicknameInput;
	if (userInput && passInput1 && passInput2) {
		if (passInput1 === passInput2) {
			db.add_user(userInput, passInput1, nickInput, function(err, u) {
				if (err || !u) {
					if (err === 'user already exists') {
						res.redirect('/signup?err=3');
					} else {
						res.redirect('/signup?err=4');
					}
				} else {
					req.session.userID = u.userID;
					req.session.userNick = u.nickname;
					req.session.loggedIn = true;
					res.redirect('/');
				}
			});
		} else {
			res.redirect('/signup?err=2');
		}
	} else {
		res.redirect('/signup?err=1');
	}
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

var postJoinSession = function(req, res) {
	if (req.body.sid) {
		req.session.currentSID = req.body.sid;
		//res.redirect('/pod');
		res.send('done');
	}
};

var getPod = function(req, res) {
	//get sid of clicked on gamesession
	//keep track of sid in session variable
//	if (req.query.sid) {
//		req.session.currentSID = req.query.sid;
//		res.redirect('/pod');
//	} else if (req.session.round) {
//		console.log(req.session.round);
//		var round = req.session.round;
//		var game = null;
//		var player = null;
//		var page = 'main';
//		res.render('pod.ejs', {sid: req.session.currentSID, 
//			game: game, player: player, page: page, choices: choices});
//	} else {
//		req.session.round = 1;
//		res.redirect('/pod');
//	}
	res.render('pod.ejs', {sid: req.session.currentSID, game: null, player: null, page: 'main', choices: choices});
};

//var getSessions = function(req, res) {
//	sessions = [
//		["1", {"type": "Hide and Seek", "private": "Yes", "creator": "Steve"}],
//		["2", {"type": "Evacuation", "private": "No", "creator": "Steve"}]
//	];
//	res.send(JSON.stringify({sessions: sessions}));
//};

//var getMain = function(req, res) {
//	if (!req.session.loggedIn) {
//		res.redirect('/login');
//	} else {
//		var round = req.session.round;
//		var game = null;
//		var player = null;
//		if (round == 1 || round == null) {
//			choices.round1 = 0;
//			choices.round2 = 0;
//			choices.round3 = 0;
//			choices.round4 = 0;
//			game = "Evade";
//			player = "Hider";
//			req.session.round = 1;
//		} else if (round == 2) {
//			game = "Evade";
//			player = "Seeker";
//			req.session.round = 2;
//		} else if (round == 3) {
//			game = "Find";
//			player = "Hider";
//			req.session.round = 3;
//		} else if (round == 4) {
//			game = "Find";
//			player = "Seeker";
//			req.session.round = 4;
//		}
//		res.render('main.ejs', {game: game, player: player});
//	}
//};
	
//var processChoice = function(req, res) {
//	var thischoice = req.body.choice;
//	var round = req.session.round;
//	if (round == 1 || round == null) {
//		choices['round'+round] = thischoice;
//		req.session.round = 2;
//		res.redirect("/pod");
//	} else if (round == 2) {
//		req.session.round = 3;
//		choices['round'+round] = thischoice;
//		res.redirect("/pod");
//	} else if (round == 3) {
//		req.session.round = 4; 
//		choices['round'+round] = thischoice;
//		res.redirect("/pod");
//	} else if (round == 4) {
//		req.session.round = 5;
//		choices['round'+round] = thischoice;
//		res.redirect("/pod");
//	} else {
//		res.redirect("/");
//	}
//};

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

//this is to replace the above function
var postChoices = function(req, res) {
	var cs = req.body.choices;
	var ca = [[cs.round1, cs.round2], [cs.round3, cs.round4]];
	var ra = getHideAndSeekResults(cs);
	db.add_result(req.body.sid, req.body.gametype, ca, ra, function(err, r) {
		if (err || !r) {
			console.log('error adding result');
		}
	});
};

//used for above, probably want to change later
function getHideAndSeekResults(cs) {
	var rs = [0, 0];
	if (cs.round1 === cs.round2) {
		rs[1]+=1;
	} else {
		rs[0]+=1;
	}
	if (cs.round3 === cs.round2) {
		rs[0]+=1;
		rs[1]+=1;
	}
	return rs;
};

var postDataSID = function(req, res) {
	if (req.body.sid) {
		req.session.dataSID = req.body.sid;
		console.log(req.session.dataSID);
		res.send('done');
	}
}

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
//		db.get_results(req.session.dataSID, function(err, data) {
//			if (err || !data) {
//				console.log('error getting session results');
//			} else {
//				res.render('data.ejs', {plots: ["//plot.ly/~team19/190.embed", "//plot.ly/~team19/188.embed",
//					"//plot.ly/~team19/189.embed", "//plot.ly/~team19/194.embed"], data: data)});
//			}
//		})
		res.render('data.ejs', {plots: ["//plot.ly/~team19/190.embed", "//plot.ly/~team19/188.embed",
			"//plot.ly/~team19/189.embed", "//plot.ly/~team19/194.embed"], sid: req.session.dataSID}); 
	}
};

var postCreateSession = function(req, res) {
	if (!req.session.loggedIn) {
		res.redirect('/login');
	} else {
		db.create_session(req.body.gameTypeSelect, req.body.sessionNameInput, req.body.privateCheck === 'on', req.session.userID, 
				req.session.userNick, req.body.sessionPassword, function(err, session) {
			if (err) {
				res.redirect('/create?err=1');
			} else {
				res.redirect('/profile');
			}
		})
	}
};


var routes = {
	//get_main: getMain,
	//process_choice: processChoice,
	get_results: getResults,
	get_login: getLogin,
	post_check_login: postCheckLogin,
	get_home: getHome,
	get_profile: getProfile,
	get_create: getCreate,
	get_pod: getPod,
	//get_sessions: getSessions,
	post_choice: postChoice,
	get_data: getData,
	post_create_session: postCreateSession,
	get_signup: getSignup,
	post_create_account: postCreateAccount,
	post_join_session: postJoinSession,
	post_choices: postChoices,
	post_data_sid: postDataSID
};

module.exports = routes;