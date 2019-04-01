  var days;
  var hours;
  var progress;
  var maxProgress;
  var warningLevel;
  var evacAt;
  var timer;
  var socket = io();
  var gametype = "Evacuation";
  //var sid = "<%= sid %>";
  var gameroom;
  var role;
  var storm = false;
  
  jQuery(document).ready(function($) {
    warningLevel = 1;
    days = 1;
    hours = 0;
    progress = 0;
    maxProgress = days * 24;
    $("#timerbar").attr("aria-valuemax", maxProgress);
    $("#timeleft").html("Days: "+days+", Hours: "+hours);
    $("#resultswindow").hide();
    $("#waitingwindow").hide();
    $("#playwindow").hide();
    updateProgBar();
    $("#warninglevel").html("Warning Level: "+warningLevel); 
    
    socket.emit('find game room', {sid:sid, gametype: gametype});
    
    // tell server when user leaves/refreshes page
    $(window).bind('beforeunload', function() {
      $.post('/leavesession',function(data) { 
        socket.emit('leave queue', {sid: sid});     
      });
    });
  });
  
  socket.on('start game', function(data) {
    role = data.role;
    gameroom = data.room;
    $("#matchingwindow").hide();
    $("#playwindow").show();
  
    //updates every second (one hour of in-game time)
    timer = setInterval(function() {
      progress = progress + 1;
      hours = hours - 1;
      if (hours < 0) {
        hours = 23;
        days = days - 1;
      }
      $("#timeleft").html("Days: "+days+", Hours: "+hours);
      updateProgBar();
    
      if (days < 0) {
        endGame();
      }
      
      //updateWarningLevel();
      if (role === "Timer") {
        socket.emit('evac tick', {room: gameroom, warningLevel: warningLevel});
      }
      
    }, 1000);
  });
  
  function updateProgBar() {
    var val = progress / maxProgress * 100;
    val = Math.min(val, 100);
    $("#timerbar").css('width', val+"%").attr("aria-valuenow", val);
  }
  
  socket.on('update warning level', function(data) {
    warningLevel = data.warningLevel;
    $("#warninglevel").html("Warning Level: "+warningLevel);
    if (warningLevel == 5) {
      storm = true;
      endGame();
    }
  });
  
  function evacuate() {
    evacAt = {days: days, hours: hours, warningLevel: warningLevel};
    $("#playwindow").hide();
    $("#waitingwindow").show();
  }
  
  function endGame() {
    
    clearInterval(timer);
    $("#playwindow").hide();
    $("#waitingwindow").hide();
    $("#resultswindow").show();
    
    if (storm) {
      $("#stormstatus").html("A catastrophic storm struck!");
    } else {
      $("#stormstatus").html("The storm has passed over.");
    }
    
    if (!evacAt) {
      $("#choice").html("You chose not to evacuate.");
    } else {
      $("#choice").html("You evacuated with "+evacAt.days+" days and "+evacAt.hours+" hours remaining.");
    }
  }