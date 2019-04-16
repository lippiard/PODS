var gametype = 'EnterpriseCrowdFunding';
var gameroom;
var role;
var socket = io();

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
    
    //for testing below
    role = 'player1';
    $.getJSON("ecf_payoffs.json", function(payoffs) {
    	console.log(payoffs);
		fillPayoffTable(payoffs);
	});
});

socket.on('start game', function(data) {
	
	role = 'player1';
	
	$.getJSON("ecf_payoffs.json", function(payoffs) {
		fillPayoffTable(payoffs);
	});
});

function fillPayoffTable(payoffs) {
	for (var i = 1; i <= 10; i++) {
		$("#p"+i).html(payoffs[role][i-1]);
		$("#m"+1).html(payoffs.median[i-1]);
	}
}