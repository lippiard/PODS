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

var addUser = function(email, password, nickname, callback) {
	exists('usersTable', email, function(exists_err, result) {
		if (exists_err) {
			callback(err, null);
		} else if (!result) {
			var newuser = {email: email, userID: uuid(), password: SHA3(password).toString(), nickname: nickname};
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
	schemas.sessionsTable.scan().exec(function(err, results) {
		if (err || !results) {
			callback(err, null);
		} else {
			let rs = results.Items.map(r => r.attrs);
			callback(null, rs);
		}
	});
};

var getSessionByID = function(sid, callback) {
	schemas.sessionsTable.get(sid, function(err, s) {
		if (err || !s) {
			callback(err, null);
		} else {
			callback(null, s.attrs);
		}
	});
};

var getCreatorSessions = function(creatorid, callback) {
	schemas.sessionsTable.scan().where('creator').equals(creatorid).exec(function(err, results) {
		if (err || !results) {
			callback(err, null);
		} else {
			let rs = results.Items.map(r => r.attrs);
			callback(null, rs);
		}
	});
};


var addResult = function(sessionid, gametype, choices, results, callback) {
	var newResult = {resultid: uuid(), sessionid: sessionid, gametype: gametype, choices: choices, results: results };
	schemas.resultsTable.create(newResult, function(err, r) {
		if (err || !r) {
			callback(err, null);
		} else {
			callback(null, r.attrs);
		}
	});
};

var getSessionResults = function(sessionid, callback) {
	schemas.resultsTable.query(sessionid).exec(function(err, r) {
		if (err || !r) {
			callback(err, null);
		} else {
			let rs = r.Items.map(ri => ri.attrs);
			callback(null, rs);
		}
	});
};

var createSession = function(gametype, sessionname, privateSession, creatorid, creatornick, password, callback) {
	var newSession = {sessionid: uuid(), gametype: gametype, sessionname: sessionname, privateSession: privateSession, creator: creatorid, creatornick: creatornick, password: password};
	schemas.sessionsTable.create(newSession, function(err, s) {
		if (err || !s) {
			callback(err, null);
		} else {
			callback(null, s.attrs);
		}
	});
};

var dbfuncs = {
		get_user: getUserFromEmail,
		get_sessions: getSessions,
		get_creator_sessions: getCreatorSessions,
		create_session: createSession,
		add_user: addUser,
		add_result: addResult,
		get_results: getSessionResults,
		get_session_by_id: getSessionByID
};

module.exports = dbfuncs;
