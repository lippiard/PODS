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
    
});

socket.on('start game', function(data) {
	
	
	$.getJSON("ecf_payoffs.json", function(payoffs) {
		
	});
});