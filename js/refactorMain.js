/**
 * Project: Pong v2
 * User: Luke Edwards
 * Date: 15/11/2011
 * Time: 08:43
 * resources:
 * http://learning-computer-programming.blogspot.com/2009/09/simple-pong-game-using-javascript.html
 *
 * TODO:
 * what happens when ball goes out of play
 * create ball and randomise velocity / direction
 * pause / resume
 * spin off of paddle collision
 * sounds & animation
 * score
 */

$(document).ready(function() {
    console.log('world init');


        //world settings
    var worldSpeed      =   1,
        pause          = false,


        // court settings
        courtWidth      =   341,
        courtHeight     =   599,


        // ball settings
        ball            =   $('#ball'),
        ballWidth       =   14,
        ballHeight      =   14,
        ballX           =   $('#ball').position().left,
        ballY           =   $('#ball').position().top,
        velX            =   0,
        velY            =   0,

        //player settings
        p1              =   $('#player1'),
        p2              =   $('#player2'),
        pWidth          =   52,
        pSpeed          =   1,
        p1X             =   110,
        p2X             =   110,
        p1KeyLeft       =   37,
        p1KeyRight      =   39,
        p2KeyLeft       =   65,
        p2KeyRight      =   83,
        p1MoveLeft      =   false,
        p1MoveRight     =   false,
        p2MoveLeft      =   false,
        p2MoveRight     =   false,

        // misc keys
        spaceBar        =   32,
        enter           =   13;

    

    // centers court in browser window.
    $(window).bind('load resize', function(){
		var browserHeight = $(window).height();
		var wrapperHeight = $('#wrapper').outerHeight(true);
		var windowYoffset = ( browserHeight - wrapperHeight) /2;

		$('body').css('padding-top', windowYoffset);
	});

    // this is the timer to start + run the game loop
    setInterval(physics, worldSpeed);


    // this is where the magic happens
    function physics(){

        //move player 1
        // if move is true and it is less than court edge allow movement
        if(p1MoveLeft && p1X > 0){
            p1X -= pSpeed;
            p1.removeClass('right');
            p1.addClass('left');
        } else if (p1MoveRight && p1X <= 289){
            p1X += pSpeed;
            p1.removeClass('left');
            p1.addClass('right');
        }
        p1.css('left', p1X);

        //move player 2
        if(p2MoveLeft && p2X > 0){
            p2X -= pSpeed;
            p2.removeClass('right');
            p2.addClass('left');
        } else if (p2MoveRight && p2X <= 289){
            p2X += pSpeed;
            p2.removeClass('left');
            p2.addClass('right');
        }
        p2.css('left', p2X);


        // updates the velocity of the ball
        ballX += velX;
        ballY += velY;



        // if ball hits right or left wall
        if(ballX < 0 || ballX >= 325 ){
            // reverses the velocity
            velX = -velX;
        }

        //if ball hits player1 baseline
        if(ballY === 0){
            // and ball is within left edge of paddle and right edge of paddle
            if(ballX >= p1X && ballX <= (p1X + pWidth)){
                // bounce
                velY = -velY;
            }
        }

        //if ball hits player2 baseline
        if(ballY === 599){
            // and ball is within left edge of paddle and right edge of paddle
            if(ballX >= p2X && ballX <= (p2X + pWidth)){
                //bounce
                velY = -velY;
            }
        }

        // updates the position of the ball
        ball.css('left', ballX);
        ball.css('top', ballY);

    }

    /*function createBall(){
        if(!$('#ball').length){
            $('<div id="ball"></div>')
                .appendTo('#court');
        }
    }*/

    function killBall(){
        if(!$('#ball').length){
            $('<div id="ball"></div>')
                .appendTo('#court');
        }
    }

    // listens for key down and sets relevant var to true
    $(document).keydown(function(e)
    {
        switch(e.which)
        {
            case p1KeyLeft  : p1MoveLeft     = true;
                break;
            case p1KeyRight : p1MoveRight   = true;
                break;
            case p2KeyLeft  : p2MoveLeft     = true;
                break;
            case p2KeyRight : p2MoveRight   = true;
                break;
            case spaceBar   : e.preventDefault();
                createBall();
                console.log('space');
                break;
            case enter      : e.preventDefault();
                startPhysics();
                console.log('enter');
                break;
        }
    });

    // listens for key up and sets relevant var to false
    $(document).keyup(function(e)
    {
        switch(e.which)
        {
            case p1KeyLeft  : p1MoveLeft     = false;
                break;
            case p1KeyRight : p1MoveRight   = false;
                break;
            case p2KeyLeft  : p2MoveLeft     = false;
                break;
            case p2KeyRight : p2MoveRight   = false;
                break;
        }
    });

});

