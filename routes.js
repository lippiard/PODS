/**
 * 
 */
var sd = require('./simuldecision.js');


var getMain = function(req, res) {
	console.log(sd.get_payoffs('./HideAndSeekJson/evade.json',1,1));
	res.render('main.ejs', {});
}
	
	
var routes = {
	get_main: getMain	
};

module.exports = routes;