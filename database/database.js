const Joi = require('joi');
var vogels = require('vogels');
vogels.AWS.config.loadfromPath('credentials.json');
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
	var newuser = {email: email, userID: uuid(), password: SHA3(password).toString()};
	schemas.usersTable.create(newuser, function(err, u) {
		if (err) {
			callback(err, null);
		} else {
			callback(null, u.attrs);
		}
	});
};

addUser('tess','passwords', function(err, user){
console.log(user);
});
