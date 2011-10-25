
    var timer;
    var velx = 3;
    var vely = -3;
    var ballLeft = 200;
    var ballTop = 100;
    var score = 0;
    var high = 0;
    var padLeft = 50;
    var padTop = 350;
    var padWidth = 50;
    var boardLeft;
    function moveBall(){
        score++;
        $('#score').html(score);
        ballTop+=vely;
        ballLeft+=velx;

        // wall collision
        if(ballTop<=-50){
            vely = -vely;
            ballTop = -50;
        }
        if(ballLeft<=10){
            // game over
            clearInterval(timer);
            velx = 3;
            vely = -3;
            if(score>high){
                high = score;
                $('#high').html(high);
                $('#gameover').html('Game Over<br />New High Score').show();
            } else {
                $('#gameover').html('Game Over').show();
            }
            score = 0;
            ballLeft = 200;
            ballTop = 150;
            $('#ball').hide();
            $('#toggle').html('Start');
        }
        if(ballTop>=340){
            vely = -vely;
            ballTop = 340;
        }
        if(ballLeft>=600-10){
            velx = -velx;
            ballLeft = 590;
        }

        //paddle collision
        if(ballLeft<=40 && ballLeft-velx>=40){
            var pos = $("#paddle").position();
            if(ballTop<=pos.top && ballTop>=pos.top-95){
                velx = -velx;
                ballLeft = 40;
            }
        }
        $('#ball').css({top:ballTop+'px', left:ballLeft+'px'});
    }


    $(document).ready(function(){
        boardLeft = $('#board').offset().left;
        $(window).resize(function(){
            boardLeft = $('#board').offset().left;
        });

        $(document).keydown(function(e) {
        var offset = 10;
        var pos = $("#paddle").position();
        if(e.keyCode == '65') { // press 'a' for up
            $("#paddle").css('top', pos.top - offset);
        }
        else if(e.keyCode == '90') { // press 'z' for down
            $("#paddle").css('top',pos.top + offset);
        }
        });

        $('#toggle').click(function(){
            if($(this).html()=='Start'){
                $('#gameover').hide();
                $('#ball').show();
                $(this).html('Stop');
                timer = setInterval(moveBall, 10);
            } else {
                $(this).html('Start');
                clearInterval(timer);
            }
        });

        $('.level').change(function(){
            if($('.level:checked').val()=='hard'){
                padWidth = 25;
            } else {
                padWidth = 50;
            }
            $('#paddle').css({height:padWidth+'px'});
        });

    });