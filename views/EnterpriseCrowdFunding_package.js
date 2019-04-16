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