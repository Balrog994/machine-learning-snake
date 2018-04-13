var currentApplePosition = { x: 0, y: 0 };
var snakeHeadPosition = { x: 31, y: 23 };
var snakeDirection = { x: 0, y: -1 };
var snakeSpeed = 8;
var snakeLength = 1;
var snakeHistory = [];
var difficultyIncrease = 1.025;
var startTime = 0;
var gameOver = false;
var score = 0;


function setup() {
    startTime = millis();
    createCanvas(640, 480);
    spawnApple();
}

function draw() {
    fill(0);
    rect(0,0,640,480);
    
    if(!gameOver) {
        moveSnake();
        tryEatFood();
    }
    
    drawFood();
    drawSnake();
    drawPoints();

    if(gameOver)
        drawGameOver();
}

function drawFood() {
    fill(255, 0, 0);
    rect(currentApplePosition.x * 10, currentApplePosition.y * 10, 10, 10);
}

function drawSnake() {
    fill(255);
    rect(snakeHeadPosition.x * 10, snakeHeadPosition.y * 10, 10, 10);

    for(var i = 0; i < snakeHistory.length; i++) {
        var history = snakeHistory[i];
        rect(history.x * 10, history.y * 10, 10, 10);
    }
}

function drawPoints() {
    fill(255);
    textSize(10);
    text("Score: " + score, 10, 10);
}

function drawGameOver() {
    fill("rgba(0, 0, 0, 0.5)");
    rect(0,0,640,480);

    fill(255);
    textSize(80);
    textAlign(CENTER, CENTER);
    text("GAME OVER", 0, 0, 640, 480);
}

function keyPressed() {
    if(keyCode === LEFT_ARROW && snakeDirection.x < 1)
        snakeDirection = { x: -1, y: 0};
    else if(keyCode === RIGHT_ARROW && snakeDirection.x > -1)
        snakeDirection = { x: 1, y: 0 };
    else if(keyCode === UP_ARROW && snakeDirection.y < 1)
        snakeDirection = { x: 0, y: -1 };
    else if(keyCode === DOWN_ARROW && snakeDirection.y > -1)
        snakeDirection = { x: 0, y: 1 };
}

function spawnApple() {
    do {
        currentApplePosition = { x: Math.floor(Math.random() * 63), y: Math.floor(Math.random() * 47) };
    } while(hasHitItself(currentApplePosition));
}

function moveSnake() {
    var actualTime = millis();
    if(actualTime - startTime > (1000 / snakeSpeed))
    {
        var nextSnakeHeadPosition = {
            x: snakeHeadPosition.x + snakeDirection.x,
            y: snakeHeadPosition.y + snakeDirection.y
        };
        startTime = actualTime;

        if(isOutOfBounds(nextSnakeHeadPosition) || hasHitItself(nextSnakeHeadPosition))
            gameOver = true;
        else {
            snakeHistory.unshift(snakeHeadPosition);
            if(snakeHistory.length > snakeLength - 1) {
                snakeHistory = snakeHistory.slice(0, snakeLength - 1);
            }
            snakeHeadPosition = nextSnakeHeadPosition;
        }
    }
}

function isOutOfBounds(nextSnakeHeadPosition) {
    return nextSnakeHeadPosition.x < 0 || nextSnakeHeadPosition.x > 63 || nextSnakeHeadPosition.y < 0 || nextSnakeHeadPosition.y > 47;
}

function hasHitItself(nextSnakeHeadPosition) {
    for(var i = 0; i < snakeHistory.length; i++) {
        var history = snakeHistory[i];
        if(nextSnakeHeadPosition.x === history.x && nextSnakeHeadPosition.y === history.y)
            return true;
    }

    return false;
}

function tryEatFood() {
    if(snakeHeadPosition.x === currentApplePosition.x && snakeHeadPosition.y === currentApplePosition.y) {
        increaseDifficulty();
        increaseScore();
        spawnApple();
    }
}

function increaseDifficulty() {
    snakeSpeed *= difficultyIncrease;
    snakeLength++;
}

function increaseScore() {
    score += 100;
}