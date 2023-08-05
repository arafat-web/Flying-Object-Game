const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const SCREEN_WIDTH = canvas.width;
const SCREEN_HEIGHT = canvas.height;

const GRAVITY = 0.5;
const FLAP_HEIGHT = -8;

const birdWidth = 20;
const birdHeight = 20;

const pipeWidth = 20 ;
const pipeHeight = 400;
const pipeGap = 200;

let score = 0;

// Bird object
let bird = {
    x: 100,
    y: SCREEN_HEIGHT / 2,
    velocity: 0,
};

// Array to hold pipes
let pipes = [];

// Function to handle bird flap
function handleSpacePress(event) {
    if (event.code === "Space") {
        bird.velocity = FLAP_HEIGHT;
    }
}

document.addEventListener("keydown", handleSpacePress);

function drawBird() {
    ctx.fillStyle = "red";
    ctx.fillRect(bird.x, bird.y, birdWidth, birdHeight);
}

function drawPipe(pipeX, pipeHeight) {
    ctx.fillStyle = "green";
    ctx.fillRect(pipeX, 0, pipeWidth, pipeHeight);
    ctx.fillRect(pipeX, pipeHeight + pipeGap, pipeWidth, SCREEN_HEIGHT - (pipeHeight + pipeGap));
}

function gameLoop() {
    // Update bird's position based on velocity
    bird.y += bird.velocity;
    bird.velocity += GRAVITY;

    // Clear the canvas
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Draw the bird
    drawBird();

    // Create new pipes
    if (pipes.length === 0 || pipes[pipes.length - 1].x < SCREEN_WIDTH - 200) {
        const pipeHeight = Math.floor(Math.random() * (SCREEN_HEIGHT - pipeGap));
        pipes.push({ x: SCREEN_WIDTH, height: pipeHeight });
    }

    // Draw and move the pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
        const pipe = pipes[i];
        drawPipe(pipe.x, pipe.height);
        pipe.x -= 5;

        // Check for collisions with the bird
        if (
            bird.x + birdWidth > pipe.x &&
            bird.x < pipe.x + pipeWidth &&
            (bird.y < pipe.height || bird.y + birdHeight > pipe.height + pipeGap)
        ) {
            // Collision detected, game over
            // alert("Game Over! Your Score: " + score);
            resetGame();
            return;
        }

        // Update score if the bird passes a pipe
        if (bird.x === pipe.x + pipeWidth) {
            score++;
        }

        // Remove off-screen pipes
        if (pipe.x + pipeWidth < 0) {
            pipes.splice(i, 1);
        }
    }

    requestAnimationFrame(gameLoop);
}

function resetGame() {
    bird = {
        x: 100,
        y: SCREEN_HEIGHT / 2,
        velocity: 0,
    };
    pipes = [];
    score = 0;
}

gameLoop();

