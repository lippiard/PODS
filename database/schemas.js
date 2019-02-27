//DIRECTIONS:
//when using the loader, change the path to aws creds to '../credentials.json'
//uncomment delete functions and run schemas.js
//wait for a minute or two so tables finish deleting
//comment out delete functions, uncomment createTables function
//run schemas.js again, then comment out createTables function again
//revert aws creds path  to './credentials.json'

const Joi = require('joi');
var vogels = require('vogels');
const uuid = require('uuid/v4');
var SHA3 = require('crypto-js/sha3');
vogels.AWS.config.loadFromPath('./credentials.json');

var User = vogels.define('User', {
	hashKey: 'email',
	timestamps: true,
	schema: {
		email: Joi.string().email(),
		userID: vogels.types.uuid(),
		password: Joi.string(),
		nickname: Joi.string()
	}
});

var Session = vogels.define('Session', {
	hashKey: 'sessionid',
	rangeKey: 'gametype',
	timestamps: true,
	schema: {
		sessionid: vogels.types.uuid(),
		gametype: Joi.string(),
		sessionname: Joi.string(),
		privateSession: Joi.boolean(),
		creator: vogels.types.uuid(),
		creatornick: Joi.string(),
		password: Joi.string()
	}
});


//currently experimenting with making nrows = number players and ncols = number of choices per player
var Result = vogels.define('Result', {
	hashKey: 'sessionid',
	rangeKey: 'resultid',
	timestamps: true,
	schema: {
		resultid: vogels.types.uuid(),
		sessionid: vogels.types.uuid(),
		gametype: Joi.string(),
		choices: Joi.array().items(Joi.array().items(Joi.string())), //array of choices, nrows = number of choices per player, ncols = number of players
		results: Joi.array().items(Joi.number())
	}
});

var schemas = {
	usersTable: User,
	sessionsTable: Session,
	resultsTable: Result
};

module.exports = schemas;


// LOADER - keep commented out unless using once //

//User.deleteTable(function(err) {
//	if (err) {
//		console.log(err);
//	} else {
//		console.log('table deleted');
//	}
//});
//
//Session.deleteTable(function(err) {
//	if (err) {
//		console.log(err);
//	} else {
//		console.log('table deleted');
//	}
//});
//Result.deleteTable(function(err) {
//	if (err) {
//		console.log(err);
//	} else {
//		console.log('table deleted');
//	}
//});

//vogels.createTables(function(err) {
//	if (err) {
//		console.log(err);
//	} else {
//      var id = uuid();
//		var user = {email: 'user@user.com', userID: id, password: SHA3('password').toString(), nickname: 'Test user'};
//		User.create(user, function(err, u){
//			if (err) {
//				console.log(err);
//			} else {
//				console.log('added user', u.get());
//			}
//		});
//		
//		var sessionid = uuid();
//		
//		var session = {sessionid: sessionid, gametype:'Hide and Seek', sessionname: 'test hns', privateSession: true, creator: id, creatornick: 'Test user', password: SHA3('game pass').toString()};
//		Session.create(session, function(err, s) {
//			if (err) {
//				console.log(err);
//			} else {
//				console.log('added session', s.get());
//			}
//		});
//		
//		var result = {resultid: uuid(), sessionid: sessionid, gametype: 'Hide and Seek', choices: [['1', '2'], ['3', '3']], results: [2, 1]};
//		Result.create(result, function(err, r) {
//			if (err) {
//				console.log(err);
//			} else {
//				console.log('added result', r.get());
//			}
//		});
//	}
//});



