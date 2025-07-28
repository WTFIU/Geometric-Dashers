const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Player properties
const player = {
  x: 50,
  y: HEIGHT - 60,
  width: 40,
  height: 40,
  vy: 0,
  gravity: 0.8,
  jumpPower: -15,
  onGround: true,
  color: '#00FFFF',
};

// Ground properties
const groundHeight = 50;

// Obstacles array
const obstacles = [];

let speed = 5;
let frameCount = 0;
let gameOver = false;

function resetGame() {
  player.y = HEIGHT - groundHeight - player.height;
  player.vy = 0;
  player.onGround = true;
  obstacles.length = 0;
  frameCount = 0;
  speed = 5;
  gameOver = false;
}

function spawnObstacle() {
  // Random size and gap
  const size = 30 + Math.random() * 20;
  obstacles.push({
    x: WIDTH + size,
    y: HEIGHT - groundHeight - size,
    width: size,
    height: size,
    color: '#FF4500',
  });
}

function update() {
  if (gameOver) return;

  frameCount++;

  // Increase difficulty every 500 frames
  if (frameCount % 500 === 0) {
    speed += 0.5;
  }

  // Player physics
  player.vy += player.gravity;
  player.y += player.vy;

  if (player.y + player.height > HEIGHT - groundHeight) {
    player.y = HEIGHT - groundHeight - player.height;
    player.vy = 0;
    player.onGround = true;
  } else {
    player.onGround = false;
  }

  // Spawn obstacles randomly
  if (frameCount % 90 === 0) {
    spawnObstacle();
  }

  // Move obstacles & check collision
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].x -= speed;

    if (
      player.x < obstacles[i].x + obstacles[i].width &&
      player.x + player.width > obstacles[i].x &&
      player.y < obstacles[i].y + obstacles[i].height &&
      player.y + player.height > obstacles[i].y
    ) {
      gameOver = true;
    }

    // Remove off-screen obstacles
    if (obstacles[i].x + obstacles[i].width < 0) {
      obstacles.splice(i, 1);
    }
  }
}

function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Draw ground
  ctx.fillStyle = '#333';
  ctx.fillRect(0, HEIGHT - groundHeight, WIDTH, groundHeight);

  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw obstacles
  obstacles.forEach((obs) => {
    ctx.fillStyle = obs.color;
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  });

  // Draw Game Over text
  if (gameOver) {
    ctx.fillStyle = '#FF5555';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', WIDTH / 2, HEIGHT / 2);
    ctx.font = '24px Arial';
    ctx.fillText('Press Space or Click to Restart', WIDTH / 2, HEIGHT / 2 + 40);
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function jump() {
  if (!gameOver && player.onGround) {
    player.vy = player.jumpPower;
    player.onGround = false;
  } else if (gameOver) {
    resetGame();
  }
}

// Input handlers
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    jump();
  }
});
window.addEventListener('mousedown', () => {
  jump();
});

resetGame();
gameLoop();
