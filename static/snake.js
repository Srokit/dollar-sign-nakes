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
CANVAS_H = 800;

MAX_FRAMES_SINCE_LAST_MOVE = 10;
FPS = 60;
STARTING_BLOCK_NUM = 3;

// START execution functions

// Runs the main game loop
function main(canvasContext, game_name, playerID) {

    var connection = new Connection();

    var updateGameInterval = setInterval(function () {
        connection.getGameState(game_name, playerID, function (gameState, wasDisconnected) {

            if(wasDisconnected) {
                alert("DISCONNECTED FROM game: "+game_name);
                clearInterval(updateGameInterval);
            }

            console.log(gameState.goldPiece);

            fillCanvas(canvasContext, BLACK);

            drawBlock(canvasContext, gameState.goldPiece.pos.x, gameState.goldPiece.pos.y, GOLD);

            for(var key in gameState.players) {
                if(gameState.players.hasOwnProperty(key)) {
                    var player = gameState.players[key];
                    for(var i = 0; i < player.snake.segments.length; ++i) {
                        drawBlock(canvasContext, player.snake.segments[i].pos.x, player.snake.segments[i].pos.y, GREEN)
                    }

                }
            }
        });

    }, 1000 / FPS)

    document.addEventListener('keydown', function(event) {

        switch(event.key) {

            case 'ArrowUp':
                connection.postChangeDir(game_name, playerID, 'up');
                break;
            case 'ArrowDown':
                connection.postChangeDir(game_name, playerID, 'down');
                break;
            case 'ArrowLeft':
                connection.postChangeDir(game_name, playerID, 'left');
                break;
            case 'ArrowRight':
                connection.postChangeDir(game_name, playerID, 'right');
                break;
            default:
                break; // Nothing
        }
    });
}

// Helpers Below

function fillCanvas(canvasContext, bgColor) {

    canvasContext.fillStyle = bgColor;
    canvasContext.fillRect(0,0,CANVAS_W,CANVAS_H);
}

function drawBlock(canvasContext, posX, posY, color) {

    canvasContext.fillStyle = color;
    canvasContext.fillRect(posX, posY, BLOCK_SIZE, BLOCK_SIZE);
}

// END execution functions