// your-script.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const bird = { x: 50, y: canvas.height / 2, speedY: 0, gravity: 0.5, jumpStrength: -8 };
const pipes = [];
const pipeWidth = 40;
const pipeGap = 100;
let score = 0;
let isGameOver = false;

// Event listener for jump
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space' && !isGameOver) {
    bird.speedY = bird.jumpStrength;
  }
});

// Game loop
function gameLoop() {
  if (!isGameOver) {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update bird position
    bird.speedY += bird.gravity;
    bird.y += bird.speedY;

    // Draw bird
    ctx.fillStyle = 'blue';
    ctx.fillRect(bird.x, bird.y, 20, 20);

    // Generate pipes
    if (Math.random() < 0.02) {
      const pipeHeight = Math.random() * (canvas.height - pipeGap);
      pipes.push({ x: canvas.width, y: 0, height: pipeHeight });
      pipes.push({ x: canvas.width, y: pipeHeight + pipeGap, height: canvas.height - pipeHeight - pipeGap });
    }

    // Update pipes position
    for (let i = 0; i < pipes.length; i++) {
      pipes[i].x -= 2;
      // Check collision with bird
      if (bird.x + 20 > pipes[i].x && bird.x < pipes[i].x + pipeWidth &&
          (bird.y < pipes[i].height || bird.y + 20 > pipes[i].height + pipeGap)) {
        isGameOver = true;
      }
      // Remove off-screen pipes
      if (pipes[i].x + pipeWidth < 0) {
        pipes.splice(i, 1);
        i--;
        score++;
      }
    }

    // Draw pipes
    ctx.fillStyle = 'green';
    for (let i = 0; i < pipes.length; i++) {
      ctx.fillRect(pipes[i].x, pipes[i].y, pipeWidth, pipes[i].height);
      ctx.fillRect(pipes[i].x, pipes[i].height + pipeGap, pipeWidth, canvas.height - pipes[i].height - pipeGap);
    }

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    // Check game over
    if (bird.y + 20 > canvas.height || bird.y < 0) {
      isGameOver = true;
    }

    // Continue game loop
    requestAnimationFrame(gameLoop);
  } else {
    // Game over message
    ctx.fillStyle = 'red';
    ctx.font = '36px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
  }
}

// Start the game loop
gameLoop();
