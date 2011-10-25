/**
 * PONG
 */
 
var Pong = (function(){
    
    /**
     * Setup default settings
     */
    var defaults = {
        width: 500,
        height: 350,
        ballSpeed: 6,
        paddleSpeed: 8,
        ball: {
            width: 20,
            height: 20,
            color: 'rgb(0,0,0)'
        },
        topPaddle: {
            width: 80,
            height: 20,
            color: 'rgb(255,0,0)',
            left: "a",
            right: "s"
        },
        bottomPaddle: {
            width: 80,
            height: 20,
            color: 'rgb(0,0,255)',
            left: "left",
            right: "right"
        }
    };
    
    /**
     * Constructor for Pong, i.e. a new game of Pong
     */
    function Pong(config) {
    
        this.config = config = merge( defaults, config );
        
        this.canvas = document.createElement('canvas');
        this.height = config.height;
        this.width = config.width;
        
        this.paddleSpeed = config.paddleSpeed;
        this.ballSpeed = config.ballSpeed;
        
        this.context = this.canvas.getContext('2d');
        
        this.canvas.height = this.height;
        this.canvas.width = this.width;
        
        this.newGame();
        
    }
    
    /**
     * keyIsDown method, used in Paddle instances to determine
     * whether a key is down at any time
     */
    Pong.keyIsDown = (function(){
    
        var keys = {
            37: "left",
            39: "right",
            65: "a",
            83: "s"
        };
        
        var down = {};
        
        document.onkeydown = function(e) {
            var key = (e || window.event).keyCode;
            down[keys[key]] = true;
        };
        
        document.onkeyup = function(e) {
            var key = (e || window.event).keyCode;
            down[keys[key]] = false;
        };
        
        return function(key){
            return !!down[key];
        };
        
    })();
    
    /**
     * Paddle constructor, prepares Paddle instances, nothing special
     */
    function Paddle(pong, config, position){
    
        this.config = config;
        this.width = config.width;
        this.height = config.height;
        this.x = position.x;
        this.y = position.y;
        this.pong = pong;
        
    }
    
    /**
     * Ball constructor, prepares Ball instances,
     * determines initial deltaX and deltaY fields
     * dependent on specified ballSpeed. E.g. if we want
     * a speed of 5, then we must make sure that:
     * Math.abs(deltaX) + Math.abs(deltaY) === 5
     */
    function Ball(pong, config, position){
        
        this.config = config;
        this.width = config.width;
        this.height = config.height;
        
        this.deltaY = Math.floor(Math.random() * pong.ballSpeed) + 1;
        this.deltaX = pong.ballSpeed - this.deltaY;
        
        // Half the time, we want to reverse deltaY
        // (making the ball begin in a random direction)
        if ( Math.random() > 0.5 ) {
            this.deltaY = -this.deltaY;
        }
		
        // Half the time, we want to reverse deltaX
        // (making the ball begin in a random direction)
        if ( Math.random() > 0.5 ) {
            this.deltaX = -this.deltaX;
        }
        
        this.x = position.x;
        this.y = position.y;
        this.pong = pong;
        
        this.delay = 50;
        
    }
    
    /**
     * merge - helper function to combine objects, giving
     * the "target" precedence. Used to add to prototypes.
     */
    function merge( target, source ) {
        
        if ( typeof target !== 'object' ) {
            target = {};
        }
        
        for (var property in source) {
            
            if ( source.hasOwnProperty(property) ) {
                
                var sourceProperty = source[ property ];
                
                if ( typeof sourceProperty === 'object' ) {
                    target[ property ] = merge( target[ property ], sourceProperty );
                    continue;
                }
                
                target[ property ] = sourceProperty;
                
            }
            
        }
        
        for (var a = 2, l = arguments.length; a < l; a++) {
            merge(target, arguments[a]);
        }
        
        return target;
        
    }
    
    /**
     * The setLocation method is the same for the Ball and
     * Paddle classes, for now, we're just drawing rectangles!
     */
    Paddle.prototype.setLocation = Ball.prototype.setLocation = function( x, y ) {
        this.pong.context.fillStyle = this.config.color;
        this.pong.context.fillRect(
            x - this.width / 2,
            y - this.height / 2,
            this.width,
            this.height
        );
    };
    
    merge( Pong.prototype, {
        
        /**
         * A new game, initialises a top and bottom paddle, and
         * calls newRound
         */
        newGame: function() {
        
            this.topPaddle = new Paddle(this, this.config.topPaddle, {
                x: this.width /  2,
                y: this.config.ball.height + this.config.topPaddle.height/2
            });
            
            this.bottomPaddle = new Paddle(this, this.config.bottomPaddle, {
                x: this.width /  2,
                y: this.height - this.config.ball.height - this.config.bottomPaddle.height/2
            });
            
            this.newRound();
            
        },
        
        /**
         * newRound initalises a new Ball!
         */
        newRound: function() {
        
            this.ball = new Ball(this, this.config.ball, {
                x: this.width /  2,
                y: this.height / 2
            });
            
        },
        
        /**
         * Starting a new game involves initialising an
         * interval which will run every 20 milliseconds
         */
        start: function() {
        
            var pong = this;
        
            pong.interval = setInterval(function(){
                pong.draw();
            }, 20);
            
            // Return this for chainability
            return this;
            
        },
        
        /**
         * draw, called every few milliseconds to draw each
         * object to the canvas
         */
        draw: function() {
            this.context.clearRect( 0, 0, this.width, this.height);
            this.topPaddle.draw();
            this.bottomPaddle.draw();
            this.ball.draw();
        }
        
    });
    
    merge( Paddle.prototype, {
        
        /**
         * If this is the TOP paddle
         */
        isTop: function() {
            return this === this.pong.topPaddle;
        },
        
        /**
         * intersectsBall, determines whether a ball is currently
         * touching the paddle
         */
        intersectsBall: function() {
        
            var bX = this.pong.ball.x,
                bY = this.pong.ball.y,
                bW = this.pong.ball.width,
                bH = this.pong.ball.height;
            
            return (
                        this.isTop() ?
                            (bY - bH/2 <= this.y + this.height/2 && bY + bH/2 > this.y + this.height/2) :
                            (bY + bH/2 >= this.y - this.height/2 && bY - bH/2 < this.y - this.height/2)
                   ) &&
                   bX + bW/2 >= this.x - this.width/2 &&
                   bX - bW/2 <= this.x + this.width/2;
                
        },
        
        /**
         * Prepares a new frame, by taking into account the current
         * position of the paddle and the ball. setLocation is called
         * at the end to actually draw to the canvas!
         */
        draw: function() {
            
            var config = this.config,
                pong = this.pong,
                ball = pong.ball,
                ballSpeed = pong.ballSpeed,
                
                xFromPaddleCenter,
                newDeltaX,
                newDeltaY;
                
            if ( Pong.keyIsDown(config.left) && !this.isAtLeftWall() ) {
                this.x -= pong.paddleSpeed;
            }
            
            if ( Pong.keyIsDown(config.right) && !this.isAtRightWall() ) {
                this.x += pong.paddleSpeed;
            }
            
            if ( this.intersectsBall() ) {
            
                xFromPaddleCenter = (ball.x - this.x) / (this.width / 2);
                xFromPaddleCenter = xFromPaddleCenter > 0 ? Math.min(1, xFromPaddleCenter) : Math.max(-1, xFromPaddleCenter);
                
                if ( Math.abs(xFromPaddleCenter) > 0.5 ) {
                    ballSpeed += ballSpeed * Math.abs(xFromPaddleCenter);
                }
                
                newDeltaX = Math.min( ballSpeed - 2, xFromPaddleCenter * (ballSpeed - 2) );
                newDeltaY = ballSpeed - Math.abs(newDeltaX);
                
                ball.deltaY = this.isTop() ? Math.abs(newDeltaY) : -Math.abs(newDeltaY);
                ball.deltaX = newDeltaX;
                
            }
            
            this.setLocation( this.x , this.y );
            
        },
        
        /**
         * If the paddle is currently touching the right wall
         */
        isAtRightWall: function() {
            return this.x + this.width/2 >= this.pong.width;
        },
        
        /**
         * If the paddle is currently touching the left wall
         */
        isAtLeftWall: function() {
            return this.x - this.width/2 <= 0;
        }
    
    });
    
    merge( Ball.prototype, {
    
        /**
         * If the ball is currently touching a wall
         */
        isAtWall: function() {
            return this.x + this.width/2 >= this.pong.width || this.x - this.width/2 <= 0;
        },
        
        /**
         * If the ball is currently at the top
         */
        isAtTop: function() {
            return this.y - this.height/2 <= 0;
        },
        
        /**
         * If the paddle is currently at the bottom
         */
        isAtBottom: function() {
            return this.y + this.height/2 >= this.pong.height;
        },
        
        /**
         * Simply continues the progression of the ball, by
         * setting the location to the prepared x/y values
         */
        persist: function() {
            this.setLocation(
                this.x,
                this.y
            );
        },
        
        /**
         * Takes care of the inital delay on each new round
         */
        delaying: function() {
            return --this.delay > 0;
        },
        
        /**
         * Prepares the ball to be drawn to the canvas,
         * to bounce the ball off the walls, the deltaX
         * field is simply inverted (+5 becomes -5).
         */
        draw: function() {
        
            if ( this.delaying() ) {
                this.persist();
                return;
            }
        
            if ( this.isAtWall() ) {
                this.deltaX = -this.deltaX;
            }
            
            if ( this.isAtBottom() || this.isAtTop() ) {
                this.pong.newRound();
            }
            
            this.x = this.x + this.deltaX;
            this.y = this.y + this.deltaY;
            
            this.persist();
            
        }
    
    });
    
    return Pong;
    
})();