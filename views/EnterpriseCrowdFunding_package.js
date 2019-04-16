var gametype = 'EnterpriseCrowdFunding';
var gameroom;
var role;
var socket = io();
var funds = 0;
var maxfunds = 80;

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
    role = 'player1';
    fillPayoffTable();
    $("#matchingwindow").hide();
    $("#playwindow").show();
});

socket.on('start game', function(data) {
	
	role = 'player1';
	
	$.getJSON("ecf_payoffs.json", function(payoffs) {
		fillPayoffTable(payoffs);
	});
});

function submitAllocation() {
	var allos = [];
	for (var i = 1; i <= 10; i++) {
		allos.push($("#a"+i).val());
	}
	$("#allotest").html(allos);
	$("#playwindow").hide();
	$("#resultswindow").show();
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