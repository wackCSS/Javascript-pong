/*
http://learning-computer-programming.blogspot.com/2009/09/simple-pong-game-using-javascript.html
http://gamedev.stackexchange.com/questions/11679/am-i-on-the-right-track-with-pong
http://www.mclelun.com/blog/2010/01/javascript-pong-game/
http://stackoverflow.com/questions/6363010/where-does-the-context-live-in-an-oop-javascript-pong-game
http://eloquentjavascript.net/chapter8.html
http://codeincomplete.com/posts/2011/5/14/javascript_pong/
http://codeincomplete.com/posts/2011/5/14/javascript_pong/part1/
http://james.padolsey.com/demos/jspong/

http://www.koonsolo.com/news/model-view-controller-for-games/
http://www.koonsolo.com/news/dewitters-gameloop/

http://www.destructoid.com/blogs/LK4O4/javascript-pong-shortblog--190355.phtml
https://github.com/chrislo/Pong5
http://www.gamedev.net/topic/552734-problem-with-collision-detection-in-javascript-pong/

http://www.metanetsoftware.com/technique/tutorialA.html
*/

$(document).ready(function() {
	var worldTime;
	/**
	 * centers court in browser
	*/
	$(window).bind('load resize', function(){
		var browserHeight = $(window).height();
		var wrapperHight = $('#wrapper').outerHeight(true);
		var windowYoffset = ( browserHeight - wrapperHight) /2;

		$('body').css('padding-top', windowYoffset);
	});



	//setInterval('moveBall()', 1 * 1000);



	/**
	 * Setup default settings
	*/
	var defaults = {
		browser: {
			width: $(window).width(),
			height: $(window).height()
		},
		world:{
			timer: 100
		},
		court: {
			width: $('#court').outerWidth(true),
			height: $('#court').outerHeight(true)
		},
		ball: {

			width: $('#ball').width(),
			height: $('#ball').height(),
			leftPos: 165,
			topPos: 294,
			velX: 5,
			velY: 5
		},
		player1: {
			speed: 10,
			sprite: $('#player1'),
			width: $('#player1').width(),
			height: $('#player1').height(),
			leftPos: 0,
			left: 37,
			keyLeft: false,
			right: 39,
			keyRight: false
		},
		player2: {
			speed: 10,
			sprite: $('#player2'),
			width: $('#player2').width(),
			height: $('#player2').height(),
			leftPos: 1,
			left: 65,
			keyLeft: false,
			right: 83,
			keyRight: false
		}
	};


	/**
	 * Listen for keystrokes
	*/
	var keyPress = (function(){

		$(document).keydown(function(e)
		{
			switch(e.which)
			{
				// player1 presses the left arrow
				case defaults.player1.left:			console.log("left arrow down");
													defaults.player1.keyLeft = true;
													playerMove();
													break;
				// player1 presses the right arrow
				case defaults.player1.right:		console.log("right arrow down");
													defaults.player1.keyRight = true;
													playerMove();
													break;
				// player2 presses the a key
				case defaults.player2.left:			console.log("a key down");
													defaults.player2.keyLeft = true;
													playerMove();
													break;
				// player2 presses the s key
				case defaults.player2.right:		console.log("s key down");
													defaults.player2.keyRight = true;
													playerMove();
													break;
			}
		});

		$(document).keyup(function(e)
		{
			switch(e.which)
			{
				// player1 releases the left arrow
				case defaults.player1.left:			console.log("left arrow up");
													defaults.player1.keyLeft = false;

													break;
				// player1 releases the right arrow
				case defaults.player1.right:		console.log("right arrow up");
													defaults.player1.keyRight = false;
													break;
				// player2 releases the a key
				case defaults.player2.left:			console.log("a key up");
													defaults.player2.keyLeft = false;
													break;
				// player2 releases the s key
				case defaults.player2.right:		console.log("s key up");
													defaults.player2.keyRight = false;
													break;
			}
		});

	})();




	var playerMove = function(){

		if(defaults.player1.keyRight === true && defaults.player1.leftPos <= defaults.court.width - defaults.player1.width){
			defaults.player1.leftPos += defaults.player1.speed;
		}

		if(defaults.player1.keyLeft === true && defaults.player1.leftPos > 0){
			defaults.player1.leftPos -= defaults.player1.speed;
		}

        if(defaults.player2.keyRight === true && defaults.player2.leftPos <= defaults.court.width - defaults.player2.width){
			defaults.player2.leftPos += defaults.player2.speed;
		}

		if(defaults.player2.keyLeft === true && defaults.player2.leftPos > 0){
			defaults.player2.leftPos -= defaults.player2.speed;
		}

		$('#player1').css('left', defaults.player1.leftPos);
        $('#player2').css('left', defaults.player2.leftPos);
	};


	var moveBall = function(){
		// plan is to check position of ball and see if it collides then update position

        //if ball touches RHS of court
		if(defaults.ball.leftPos >= 330 ){
			defaults.ball.velX = -defaults.ball.velX;
		}


		//if ball touches LHS of court
		if(defaults.ball.leftPos <= 0){
			defaults.ball.velX = -defaults.ball.velX;
		}


		// if ball bounces off bottom of court
		/*if(defaults.ball.topPos >= 585){
			defaults.ball.velY = -defaults.ball.velY;
		}*/


		// if ball bounces off top of court
		/*if(defaults.ball.topPos <= 0){
			defaults.ball.velY = -defaults.ball.velY;
		}*/

		defaults.ball.leftPos += defaults.ball.velX;
        defaults.ball.topPos += defaults.ball.velY;

        $('#ball').css('left', defaults.ball.leftPos);
        $('#ball').css('top', defaults.ball.topPos);

	};

	setInterval(moveBall, defaults.world.timer);

    console.log('jQuery Loaded');

});