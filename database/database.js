const Joi = require('joi');
var vogels = require('vogels');
vogels.AWS.config.loadFromPath('./credentials.json');
var schemas = require('./schemas.js');
var SHA3 = require('crypto-js/sha3');
const uuid = require('uuid/v4');

var exists = function(table, key, callback){
	schemas[table].query(key).exec(function(err, result) {
		if (err){
			callback(err, null);
		} else{
			if(result.Count > 0){
			callback(err,true);
			
			} else{
			callback(err, false);
			}
		}
	
	});
};

var addUser = function(email, password, callback) {
	exists(usersTable, email, function(exists_err, result) {
		if (err) {
			callback(err, null);
		} else if (result) {
			var newuser = {email: email, userID: uuid(), password: SHA3(password).toString()};
			schemas.usersTable.create(newuser, function(err, u) {
				if (err || !u) {
					callback(err, null);
				} else {
					callback(null, u.attrs);
				}
			});
		} else {
			callback('user already exists', null);
		}
	});	
};

var getUserFromEmail = function(email, callback) {
	schemas.usersTable.get(email, function(err, u) {
		if (err || !u) {
			callback(err, null);
		} else {
			callback(null, u.attrs);
		}
	});
};

var addSession = function(gametype, privateSession, creator, callback) {
	var newSession = {sessionid: uuid(), gametype: gametype, privateSession: true, creator: creator};
	schemas.sessionsTable.create(newSession, function(err, s) {
		if (err || !u) {
			callback(err, null);
		} else {
			callback(null, s.attrs);
		}
	});
};

var getSessions = function(callback) {
	
};


var addResult = function(sessionid, gametype, choices, results, callback) {
	var newResult = {resultid: uuid(), sessionid: sessionid, gametype: gametype, choices: choices, results: results };
	schemas.resultsTable.create(newResult, function(err, r) {
		if (err || !u) {
			callback(err, null);
		} else {
			callback(null, r.attrs);
		}
	});
};

var dbfuncs = {
		get_user: getUserFromEmail	
};

module.exports = dbfuncs;
