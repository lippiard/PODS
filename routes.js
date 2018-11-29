/**
 * 
 */
var sd = require('./simuldecision.js');

var choices = {round1: 0, round2: 0, round3: 0, round4: 0};

var getLogin = function(req, res) {
	res.render('login.ejs');
};

var postCheckLogin = function(req, res) {
	req.session.loggedIn = true;
	res.redirect('/');
};

var getHome = function(req, res) {
	if (!req.session.loggedIn) {
		res.redirect('/login');
	} else {
		res.render('home.ejs');
	}
};

var postGetUserProfile = function(req, res) {
	//user id will come through post
	//get user data from db and send to res to populate profile page
	res.redirect('/profile');
};

var getProfile = function (req, res) {
	res.render('profile.ejs');
};

var getMain = function(req, res) {
	if (!req.session.loggedIn) {
		res.redirect('/login');
	} else {
		var round = req.query.round;
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
		res.redirect("/?round=2");
	} else if (round == 2) {
		choices['round'+round] = thischoice;
		res.redirect("/?round=3");
	} else if (round == 3) {
		choices['round'+round] = thischoice;
		res.redirect("/?round=4");
	} else if (round == 4) {
		choices['round'+round] = thischoice;
		res.redirect("/results");
	} else {
		res.redirect("/");
	}
};

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


var routes = {
	get_main: getMain,
	process_choice: processChoice,
	get_results: getResults,
	get_login: getLogin,
	post_check_login: postCheckLogin,
	get_home: getHome,
	post_get_user_profile: postGetUserProfile,
	get_profile: getProfile
};

module.exports = routes;