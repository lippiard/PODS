const Joi = require('joi');
var vogels = require('vogels');
const uuid = require('uuid/v4');
var SHA3 = require('crypto-js/sha3');
vogels.AWS.config.loadFromPath('../credentials.json');

var User = vogels.define('User', {
	hashKey: 'email',
	timestamps: true,
	schema: {
		email: Joi.string().email(),
		userID: vogels.types.uuid(),
		password: Joi.string()
	}
});

var Session = vogels.define('Session', {
	hashKey: 'sessionid',
	rangeKey: 'gametype',
	timestamps: true,
	schema: {
		sessionid: vogels.types.uuid(),
		gametype: Joi.string(),
		privateSession: Joi.boolean(),
		creator: vogels.types.uuid()
	}
});

var Result = vogels.define('Result', {
	hashKey: 'sessionid',
	rangeKey: 'gametype',
	timestamps: true,
	schema: {
		sessionid: vogels.types.uuid(),
		gametype: Joi.string(),
		choices: Joi.array().items(Joi.array().items(Joi.string())),
		results: Joi.array().items(Joi.number())
	}
});

vogels.createTables(function(err) {
	if (err) {
		console.log(err);
	} else {
//		var user = {email: 'user@user.com', userID: uuid(), password: 'password'};
//		User.create(user, function(err, u){
//			if (err) {
//				console.log(err);
//			} else {
//				console.log('added user', u.get());
//			}
//		});
		
//		var session = {sessionid: uuid(), gametype:'Hide and Seek', privateSession: true, creator: uuid()};
//		Session.create(session, function(err, s) {
//			if (err) {
//				console.log(err);
//			} else {
//				console.log('added session', s.get());
//			}
//		});
		
//		var result = {sessionid: uuid(), gametype: 'Hide and Seek', choices: [['1', '2'], ['3', '3']], results: [2, 1]};
//		Result.create(result, function(err, r) {
//			if (err) {
//				console.log(err);
//			} else {
//				console.log('added result', r.get());
//			}
//		});
	}
});



