/**
 * 
 */
var fs = require('fs');

var getPayoffs = function(file, rowStrategy, colStrategy) {
	var payoffs;
	var d = JSON.parse(fs.readFileSync(file, 'utf8'));
	var rpayoffs = d.rowPlayerPayoffs;
	var cpayoffs = d.colPlayerPayoffs;
	return [rpayoffs[rowStrategy][colStrategy], cpayoffs[rowStrategy][colStrategy]];
};

var toExport = {
		get_payoffs: getPayoffs
}; 

module.exports = toExport;