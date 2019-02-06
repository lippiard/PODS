const Joi = require('joi');
var vogels = require('vogels');
vogels.AWS.config.loadFromPath('credentials.json');

var User = vogels.define('User', {
	hashkey: 'email',
	timestamps: true,
	schema: {
		email: Joi.string().email(),
		userID: vogels.types.uuid(),
		password: Joi.string()
	}
});