	var socketChoices;
    //var sid = "<%= sid %>";
    var round;
    var socket = io();
    var gameroom;
    var role;
    var gametype = 'HideAndSeek';
  
    jQuery(document).ready(function($) {
      $("#nav-placeholder").load("nav.ejs", function() {
        $(".nav").find(".active").removeClass("active");
      });
      
      $("#matchingscreen").show();
      $("#playscreen").hide();
      $("#waitingscreen").hide();
      $("#resultsscreen").hide();
      $("#playerleftscreen").hide();
      
      round = 1;
      
      socket.emit('find game room', {sid:sid, gametype: gametype}); //find game room (pair with one other user in session)
      
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
      if (role === "Hider") {
        $("#playscreen").show();
        $("#waitingscreen").hide();
      } else {
        $("#playscreen").hide();
        $("#waitingscreen").show();
      }
      $("#matchingscreen").hide();
      $("#playername").html(role);
      $("#gamename").html("Evade");
      
      // new stuff //
      socketChoices = data.choices;
      ///////////////
      
    });
    
    window.addEventListener( "pageshow", function ( event ) {
      var historyTraversal = event.persisted || 
                         ( typeof window.performance != "undefined" && 
                              window.performance.navigation.type === 2 );
      if ( historyTraversal ) {
        window.location.href = '/';
      }
    }); 
    
    var formSubmit = function() {
      var choice = $("input[name='choice']:checked").val();
      $("input[name='choice']:checked").prop('checked', false); //unselect selected radio button (to reset for next round)
      //$.post('/postchoice', {choice: choice, round: round});
      $('#playscreen').hide();
      $('#waitingscreen').show();
      var player = "<%= player %>"
      
      // new stuff //
      socketChoices['round'+round] = choice;
      ///////////////
      
      socket.emit('made choice', {player: player, room: gameroom, choices: socketChoices});
      round++;
    };
    
    socket.on('your turn', function(data) {
      socketChoices = data.choices;
      round++;
      if (round > 4) {
        socket.emit('last round played', {room: gameroom, choices: socketChoices});
        endGame(data);
      } else {
        if (round == 1 || round == 2) {
          $("#gamename").html("Evade");
        } else if (round == 3 || round == 4) {
          $("#gamename").html("Find");
        }
      
        $('#playscreen').show();
        $('#waitingscreen').hide();	
      }
    });
    
    socket.on('end game', function(data) {
      endGame(data);
    });
    
    function endGame(data) {
    
      //new stuff //
      if (data) {
        socketChoices = data.choices;
        
        $('#playscreen').hide();
        $('#waitingscreen').hide();
        $('#resultsscreen').show();
        $('#choice1').html(socketChoices.round1);
        $('#choice2').html(socketChoices.round2);
        $('#choice3').html(socketChoices.round3);
        $('#choice4').html(socketChoices.round4);
      
        if (socketChoices.round1 === socketChoices.round2) {
          $('#evadeWinner').text('Seeker');
        } else {
          $('#evadeWinner').text('Hider');
        }
     
        if (socketChoices.round3 === socketChoices.round4) {
          $('#findResult').text('win');
        } else {
          $('#findResult').text('lose');
        }
        
      }
      if (role === 'Hider') {
        $.post('/postchoices', {choices: socketChoices, sid: sid, gametype: gametype});
      }
      
      //////////////////////
      
//      var cs = {round1: 0, round2: 0, round3: 0, round4: 0};
//      $.post('/postchoice', {round: 5}, function(data) {
//        cs.round1 = data.choices.round1;
//        cs.round2 = data.choices.round2;
//        cs.round3 = data.choices.round3;
//        cs.round4 = data.choices.round4;
//        
//        $('#playscreen').hide();
//        $('#waitingscreen').hide();
//        $('#resultsscreen').show();
//      
//        $('#choice1').html(cs.round1);
//        $('#choice2').html(cs.round2);
//        $('#choice3').html(cs.round3);
//        $('#choice4').html(cs.round4);
//      
//        if (cs.round1 === cs.round2) {
//          $('#evadeWinner').text('Seeker');
//        } else {
//          $('#evadeWinner').text('Hider');
//        }
//      
//        if (cs.round3 === cs.round4) {
//          $('#findResult').text('win');
//        } else {
//          $('#findResult').text('lose');
//        }
//      });
      
    }
