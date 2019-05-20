// Defining variables
// Get the modal tags
const winningModal = document.getElementById('winningModal');
const startModal = document.getElementById('startModal');
const start = document.getElementById('start');

// play again resets all
const playAgain = document.getElementById("play-again");

// Close button and overlay
const close = document.getElementsByClassName("close")[0];
const overlay = document.getElementsByClassName("overlay")[0];

// setting initial score
let score = 0;

// Drawing the score
function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText("Score: " + score, 8, 20);
}

// Enemies to avoid: setting position, speed and sprite
let Enemy = function (x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
};

// Updating enemy sprite
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    //Bugs appearing with random speeds when hits wall
    if (this.x >= 505) {
        this.x = -60;
        // The speed was increased to at least 100, so the game will be more fun
        this.speed = 100 + Math.floor((Math.random() * 100) + 1);
    }

    // Checking collision
    if (this.x < player.x + 60 && this.x + 60 > player.x &&
        this.y < player.y + 40 && 40 + this.y > player.y) {

        // Reseting game, showing modal
        player.reset();
        winningModal.style.display = "block";
        overlay.style.display = "block";
        if (score > 5) {
            // Message if scores 5 or lower.
            document.getElementById('winning').innerHTML = `Score: ${score} <br/> That's a really good score. Congratulations!!!`;
        } else {
            // Message if scores more than 5
            document.getElementById('winning').innerHTML = `Score: ${score} <br/> I know you can do better. Keep improving!`;
        }

        // Reset score
        score = 0;
        dismissModal();
    }
};

// Drawing the enemies
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    drawScore();
};

// Now write your own player class
let Player = function (x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function (dt) {

    // If tries to go further right
    if (this.x > 400) {
        this.x = 400;
    }
    // If tries to go further left
    if (this.x < 0) {
        this.x = 0;
    }
    // If tries to go further down
    if (this.y > 400) {
        this.y = 400;
    }
    // If reaches water
    if (this.y < 0) {
        this.y = 0;
        score += 1;
        player.reset();
    }

};

// Drawing player's sprite
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Creating new player at starter posicion
let player = new Player(202, 404);

// Event from keyboard moves player
Player.prototype.handleInput = function (arrowKeyPress) {
    // Moving if correct key is pressed
    if (arrowKeyPress == 'right') {
        this.x += 101;
    }

    if (arrowKeyPress == 'left') {
        this.x -= 101;
    }

    if (arrowKeyPress == 'up') {
        this.y -= 84;
    }

    if (arrowKeyPress == 'down') {
        this.y += 84;
    }

};

//Resetting player's when hit water or collid, to starter position
Player.prototype.reset = function () {
    this.x = 202;
    this.y = 404;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
let allEnemies;
function chooseLevel() {
    if (document.getElementById("easy").checked) {
        // if easy radio button is checked
        allEnemies = [
            new Enemy(0, 60, 50 + Math.floor((Math.random() * 100) + 1)),
            new Enemy(0, 140, 50 + Math.floor((Math.random() * 100) + 1)),
            new Enemy(0, 225, 50 + Math.floor((Math.random() * 500) + 1))];
    } else {
        // if hard radio button is checked - duplicate enemies
        allEnemies = [
            new Enemy(0, 60, 25 + Math.floor((Math.random() * 100) + 1)),
            new Enemy(0, 60, 75 + Math.floor((Math.random() * 100) + 1)),
            new Enemy(0, 140, 25 + Math.floor((Math.random() * 100) + 1)),
            new Enemy(0, 140, 75 + Math.floor((Math.random() * 100) + 1)),
            new Enemy(0, 225, 25 + Math.floor((Math.random() * 500) + 1)),
            new Enemy(0, 225, 75 + Math.floor((Math.random() * 500) + 1))];
    }

}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    // Blocks player from play when modal is open
    if (playAgain.offsetParent == null) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        player.handleInput(allowedKeys[e.keyCode]);
    }

});

// Function that starts the game
startGame();
function startGame() {
    start.onclick = function () {
        startModal.style.display = "none";
        overlay.style.display = "none";
        chooseLevel();
        // Engine was necessary to call later, so the player can choose the level to play
        var script = document.createElement('script');
        script.src = 'js/engine.js';

        document.body.appendChild(script);
    };
}

// To dismiss the modal
function dismissModal() {

    // Close the modal, play again
    playAgain.onclick = function () {
        winningModal.style.display = "none";
        overlay.style.display = "none";
        chooseLevel();
        player.reset();
        score = 0;
    }

    // Close the modal, close button
    close.onclick = function () {
        winningModal.style.display = "none";
        overlay.style.display = "none";
        player.reset();
        score = 0;
    }

    // Close the modal, when clicks overlay
    overlay.onclick = function () {
        winningModal.style.display = "none";
        overlay.style.display = "none";
        player.reset();
        score = 0;
    }
}