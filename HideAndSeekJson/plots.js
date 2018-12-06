/**
 * http://usejsdoc.org/
 */
var fs = require('fs');
var plotly = require('plotly')("team19", "GXzpEzKKfMsqioq0V6K6")
//console.log(Plotly);

var data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

var total =  data.totalGamesPlayed;

//evade hider counts
var evadeHiderCountPercents = data.evadeHiderCount.map(function(element) {
	return element/total;
});

//evade seeker counts
var evadeSeekerCountPercents = data.evadeSeekerCount.map(function(element) {
	return element/total;
});

//evade scores
var evadeHiderScorePercents = data.evadeHiderScore.map(function(element) {
	return element/total;
});
var evadeSeekerScorePercents = data.evadeSeekerScore.map(function(element) {
	return element/total;
});


//find hider counts
var findHiderCountPercents = data.findHiderCount.map(function(element) {
	return element/total;
});

//evade seeker counts
var findSeekerCountPercents = data.findSeekerCount.map(function(element) {
	return element/total;
});

//find scores
var findHiderScorePercents = data.findHiderScore.map(function(element) {
	return element/total;
});
var findSeekerScorePercents = data.findSeekerScore.map(function(element) {
	return element/total;
});

var trace1 = {
	  x: ['Box 1', 'Box 2', 'Box 3', 'Box 4'],
	  y: evadeHiderCountPercents,
	  name: "Hider",
	  type: "bar"
		};
var trace2 = {
		x: ['Box 1', 'Box 2', 'Box 3', 'Box 4'],
		y: evadeSeekerCountPercents,
		name: "Seeker",
		type: "bar"
};
var data = [trace1, trace2];
var layout = {barmode: "group", title: "Evade Selections",
		  xaxis: {
			    title: "Box Picked",
			  },
			  yaxis: {
			    title: "Frequency",
			  }};
var graphOptions = {layout: layout, filename: "grouped-bar", fileopt: "new"};
plotly.plot(data, graphOptions, function (err, msg) {
   console.log(msg.url);
});

var trace1 = {
		  x: ['Box 1', 'Box 2', 'Box 3', 'Box 4'],
		  y: findHiderCountPercents,
		  name: "Hider",
		  type: "bar"
			};
	var trace2 = {
			x: ['Box 1', 'Box 2', 'Box 3', 'Box 4'],
			y: findSeekerCountPercents,
			name: "Seeker",
			type: "bar"
	};
	var data = [trace1, trace2];
	var layout = {barmode: "group", title: "Find Selections",
			  xaxis: {
				    title: "Box Picked",
				  },
				  yaxis: {
				    title: "Frequency",
				  }};
	var graphOptions = {layout: layout, filename: "grouped-bar", fileopt: "new"};
	plotly.plot(data, graphOptions, function (err, msg) {
	   console.log(msg.url);
	});
	
	
	var trace1 = {
			  x: ['Box 1', 'Box 2', 'Box 3', 'Box 4'],
			  y: evadeHiderScorePercents,
			  name: "Hider",
			  type: "bar"
				};
		var trace2 = {
				x: ['Box 1', 'Box 2', 'Box 3', 'Box 4'],
				y: evadeSeekerScorePercents,
				name: "Seeker",
				type: "bar"
		};
		var data = [trace1, trace2];
		var layout = {barmode: "group", title: "Evade Wins",
				  xaxis: {
					    title: "Box Picked",
					  },
					  yaxis: {
					    title: "Evade Win Percentage",
					  }};
		var graphOptions = {layout: layout, filename: "grouped-bar", fileopt: "new"};
		plotly.plot(data, graphOptions, function (err, msg) {
		   console.log(msg.url);
		});
		
		var trace1 = {
				  x: ['Box 1', 'Box 2', 'Box 3', 'Box 4'],
				  y: findHiderScorePercents,
				  name: "Hider",
				  type: "bar"
					};
			var trace2 = {
					x: ['Box 1', 'Box 2', 'Box 3', 'Box 4'],
					y: findSeekerScorePercents,
					name: "Seeker",
					type: "bar"
			};
			var data = [trace1, trace2];
			var layout = {barmode: "group", title: "Find Win Percentage",
					  xaxis: {
						    title: "Box Picked",
						  },
						  yaxis: {
						    title: "Frequency",
						  }};
			var graphOptions = {layout: layout, filename: "grouped-bar", fileopt: "new"};
			plotly.plot(data, graphOptions, function (err, msg) {
			   console.log(msg.url);
			});
