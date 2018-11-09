/**
 * http://usejsdoc.org/
 */
var fs = require('fs');
var Plotly = require('plotly')("team19", "GXzpEzKKfMsqioq0V6K6")
console.log(Plotly);

//evade selections
var selections = JSON.parse(fs.readFileSync('./evadeSelections.json', 'utf8'));
var total =  selections.count1 + selections.count2 + selections.count3 + selections.count4;
var eselPercents = [selections.count1/total, selections.count2/total, selections.count3/total,
	selections.count4/total];

console.log(eselPercents);

//evade scores
var selections = JSON.parse(fs.readFileSync('./evadeScores.json', 'utf8'));
var escPercents = [selections.score1, selections.score2, selections.score3,
	selections.score4];

console.log(escPercents);

//find selections
var selections = JSON.parse(fs.readFileSync('./findSelections.json', 'utf8'));
var total =  selections.count1 + selections.count2 + selections.count3 + selections.count4;
var fselPercents = [selections.count1/total, selections.count2/total, selections.count3/total,
	selections.count4/total];

console.log(fselPercents);

//find scores
var selections = JSON.parse(fs.readFileSync('./findScores.json', 'utf8'));
var fscPercents = [selections.score1, selections.score2, selections.score3,
	selections.score4];

console.log(fscPercents);

var data = [{
	  x: ['1', '2', '3', '4'],
	  y: eselPercents,
	  type: 'bar'
	}];


	var graphOptions = {filename: "basic-bar", fileopt: "overwrite"};
	Plotly.plot(data, graphOptions, function (err, msg) {console.log(msg)});
	
	var data2 = [{
		  x: ['1', '2', '3', '4'],
		  y: fselPercents,
		  type: 'bar'
		}];


		var graphOptions = {filename: "basic-bar", fileopt: "new"};
		Plotly.plot(data2, graphOptions, function (err, msg) {console.log(msg)});

	var data3 = [{
			  x: ['1', '2', '3', '4'],
			  y: escPercents,
			  type: 'bar'
			}];


		var graphOptions = {filename: "basic-bar", fileopt: "new"};
			Plotly.plot(data3, graphOptions, function (err, msg) {console.log(msg)});
			
	var data4 = [{
				  x: ['1', '2', '3', '4'],
				  y: fscPercents,
				  type: 'bar'
				}];


		var graphOptions = {filename: "basic-bar", fileopt: "new"};
				Plotly.plot(data4, graphOptions, function (err, msg) {console.log(msg)});