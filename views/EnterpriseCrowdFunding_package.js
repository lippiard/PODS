var gametype = 'EnterpriseCrowdFunding';
var gameroom;
var role;
var socket = io();
var funds = 0;
var maxfunds = 80;
var chosenAllos = {};
var nplayers;

jQuery(document).ready(function($) {
	$("#nav-placeholder").load("nav.ejs", function() {
	  $(".nav").find(".active").removeClass("active");
	});
    
    // tell server when user leaves/refreshes page
    $(window).bind('beforeunload', function() {
      $.post('/leavesession',function(data) { 
        socket.emit('leave queue', {sid: sid});     
      });
    });
    
    $("#matchingwindow").show();
    $("#playwindow").hide();
    $("#resultswindow").hide();
    $("#waitingwindow").hide();
    
    socket.emit('find game room', {sid:sid, gametype: gametype});
    
    funds = maxfunds;
    updateFunds();
    
    for (var i = 1; i <= 10; i++) {
	    $("#a"+i).bind('keyup mouseup', function() {
	    	$(this).val((Number($(this).val())));
	    	if ($(this).val() < 0) {
	    		$(this).val(0);
	    	} else if ($(this).val() > Number($(this).attr('max'))) {
	    		$(this).val(Number($(this).attr('max')));
	    	}
	    	updateFunds();
	    });
    }
    
    //for testing below
//    role = 'player1';
//    fillPayoffTable();
//    $("#matchingwindow").hide();
//    $("#playwindow").show();
});

socket.on('start game', function(data) {
	gameroom = data.room;
	nplayers = data.numplayers;
	role = data.role;
	fillPayoffTable();
	$("#matchingwindow").hide();
	$("#playwindow").show();
});

function submitAllocation() {
	var choices = {role: role, allos: []};
	for (var i = 1; i <= 10; i++) {
		choices.allos.push(Number($("#a"+i).val()));
	}
	socket.emit('chose allo', {room: gameroom, choices: choices});
	chosenAllos[role] = choices.allos;
	$("#playwindow").hide();
	$("#waitingwindow").show();
	if (Object.keys(chosenAllos).length >= nplayers) {
		endGame();
	}
}

socket.on('allo chosen', function(data) {
	chosenAllos[data.choices.role] = data.choices.allos;
	if (Object.keys(chosenAllos).length >= nplayers) {
		endGame();
	}
});

function getProjectFunding() {
	var funding = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	for (var i = 1; i <= nplayers; i++) {
		for (var j = 0; j < 10; j++) {
			funding[j] += chosenAllos["player"+i][j];
		}
	}
	return funding
}

function endGame() {
	$("#allotest").html(JSON.stringify(chosenAllos));
	$("#playwindow").hide();
	$("#waitingwindow").hide();
	$("#resultswindow").show();
	var funding = getProjectFunding();
	for (var i = 1; i <= 10; i++) {
		$("#f"+i).html(funding[i-1]);
		if (funding[i-1] >= 100) {
			$("#f"+i).addClass("table-success");
		}
	}
	for (var i = 1; i <= nplayers; i++) {
		var row = "<tr>";
		var cs = chosenAllos["player"+i];
		for (var j = 0; j < cs.length; j++) {
			row += "<td>"+cs[j]+"</td>";
		}
		row += "</tr>";
		$("#rbody").append(row);
	}
	
}

function updateFunds() {
	funds = maxfunds;
	for (var i = 1; i <= 10; i++) {
		funds = funds - $("#a"+i).val();	
	}
	for (var i = 1; i <= 10; i++) {
		$("#a"+i).attr('max', funds + Number($("#a"+i).val()));
	}
	$("#funds").html(funds);
}

function fillPayoffTable() {
	for (var i = 1; i <= 10; i++) {
		$("#p"+i).html(payoffs[role][i-1]);
		$("#m"+i).html(payoffs.median[i-1]);
	}
}