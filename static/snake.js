// JS File that holds the main functionality for snake game

// Helpful Consts
RED = "#ff0000";
BLUE = "#0000ff";
GREEN = "#00ff00";
WHITE = "#ffffff";
BLACK = "#000000";
GOLD = "#FFD700";
GREY = "#808080";

// Global settings
BLOCK_SIZE = 20; // Make this a factor of CANVAS_W and CANVAS_H
CANVAS_W = 1000;
CANVAS_H = 700;

MAX_FRAMES_SINCE_LAST_MOVE = 10;
FPS = 60;
STARTING_BLOCK_NUM = 3;

// START Object Models

// Block object constructor
function Block() {

    this.pos = {
        x: 0,
        y: 0
    };

    this.color = BLACK;

    // Square size, so width and height are the same
    this.size = BLOCK_SIZE;

    // draw takes in a canvasContext and draws the block on it
    // with this.color inside the bounds of rect made by this.pos and this.size
    this.draw = function(canvasContext) {

        canvasContext.beginPath();
        canvasContext.rect(this.pos.x, this.pos.y, this.size, this.size);
        canvasContext.fillStyle = this.color;
        canvasContext.fill();
        canvasContext.closePath();
    };
}

function BodySegment(posX, posY) {

    this.pos = {
        x: posX,
        y: posY
    };

    this.color = GREEN;

    // BodySegment sets pos to new position
    this.move = function(newX, newY) {
        this.pos.x = newX; this.pos.y = newY;
    };
}

// Body Segment inherits from Block
BodySegment.prototype = new Block;
BodySegment.prototype.constructor = BodySegment;

function GoldPiece() {

    this.pos = {
        x: getRandom(1, CANVAS_W / BLOCK_SIZE) * BLOCK_SIZE,
        y: getRandom(1, CANVAS_H / BLOCK_SIZE) * BLOCK_SIZE
    };

    this.color = GOLD;
}

GoldPiece.prototype = new Block;
GoldPiece.prototype.constructor = GoldPiece;

function Chainable() {

    this.segments = [];

    // draw all segments in object
    this.draw = function(canvasContext) {

        for(var i = 0; i < this.segments.length; ++i) {
            this.segments[i].draw(canvasContext);
        }
    };
}

function Snake() {

    this.segments = [];
    this.direction = 'right';

    var centeringX = Math.floor(CANVAS_W / BLOCK_SIZE / 2) * BLOCK_SIZE;
    var centeringY = Math.floor(CANVAS_H / BLOCK_SIZE / 2) * BLOCK_SIZE;

    // Create initial array of Body Segments oriented horizontally
    for(var i = 0; i < STARTING_BLOCK_NUM; ++i) {
        var segment = new BodySegment(centeringX - i * BLOCK_SIZE, centeringY);
        this.segments.push( segment );
    }

    this.move = function() {

        // Save for this.addSegment method
        this.tailSegLastPos = {
            x: this.segments[this.segments.length - 1].pos.x,
            y: this.segments[this.segments.length - 1].pos.y
        };

        // Set all segment position equal to the position of the segment
        // behind them, starting from the back, ending before the head
        for(var i = this.segments.length - 1; i > 0; --i) {
            this.segments[i].pos.x = this.segments[i-1].pos.x;
            this.segments[i].pos.y = this.segments[i-1].pos.y;
        }
        // Head segment moves depending on this.direction
        switch(this.direction) {
            case 'right':
                this.segments[0].pos.x += this.segments[0].size;
                break;
            case 'left':
                this.segments[0].pos.x -= this.segments[0].size;
                break;
            case 'up':
                this.segments[0].pos.y -= this.segments[0].size;
                break;
            default:
                this.segments[0].pos.y += this.segments[0].size;
        }
    };

    this.changeDir = function(newDirection) {

        if (newDirection === 'left' && this.direction === 'right'){
            return;
        }
        else if (newDirection === 'right' && this.direction === 'left') {
            return;
        }
        else if (newDirection === 'up' && this.direction === 'down') {
            return;
        }
        else if (newDirection === 'down' && this.direction === 'up') {
            return;
        }

        this.direction = newDirection;
    };

    this.addSegment = function() {
        console.log("Adding segment");
        this.segments.push( new BodySegment(this.tailSegLastPos.x,
                                            this.tailSegLastPos.y));
    };
}

Snake.prototype = new Chainable;
Snake.prototype.constructor = Snake;

function Player(id) {

    this.id = id;
    this.snake = Snake();
}

// END Object Models

// START execution functions

// Runs the main game loop
function main(canvasContext) {

    var connection = Connection();

    var player1 = null;
    connection.thisPlayerDidEnter(function (playerID) {
        player1 = Player(playerID);
    });

    var goldPiece = new GoldPiece();

    document.addEventListener('keydown', function(event) {

        switch(event.key) {

            case 'ArrowUp':
                snake.changeDir('up');
                break;
            case 'ArrowDown':
                snake.changeDir('down');
                break;
            case 'ArrowLeft':
                snake.changeDir('left');
                break;
            case 'ArrowRight':
                snake.changeDir('right');
                break;
            default:
                break; // Nothing
        }
    });

    var framesSinceLastMove = 0;
    setInterval(function(){

        if(framesSinceLastMove == MAX_FRAMES_SINCE_LAST_MOVE) {
            player1.snake.move();

            if(checkBlockCollision(snake.segments[0], goldPiece)) {
                goldPiece = new GoldPiece(); // Gold Piece will be generated in another random location
                player1.snake.addSegment();
            }

            fillCanvas(canvasContext, BLACK);
            player1.snake.draw(canvasContext);
            goldPiece.draw(canvasContext);

            framesSinceLastMove = 0;
        }

        ++framesSinceLastMove;

    }, FPS / 1000.0);
}

// Helpers Below

function fillCanvas(canvasContext, bgColor) {

    canvasContext.fillStyle = bgColor;
    canvasContext.fillRect(0,0,CANVAS_W,CANVAS_H);
}

// Get random int from 'from' to 'to' not including to
function getRandom(from, to) {
    var randInt = Math.floor(Math.random() * (to - from)) + from;
    return randInt;
}

function checkBlockCollision(block1, block2) {
    if (block1.pos.x === block2.pos.x && block1.pos.y === block2.pos.y) {
        return true;
    }
    return false;
}

// END execution functions