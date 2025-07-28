const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const bgMusic = document.getElementById('bgMusic');
bgMusic.volume = 0.5;

// Player
const player = {
  x: 50,
  y: HEIGHT - 80,
  width: 40,
  height: 40,
  vy: 0,
  gravity: 1,
  jumpPower: -18,
  onGround: false,
  color: '#00FFFF',
};

// Platforms
const platforms = [
  { x: 0, y: HEIGHT - 40, width: WIDTH * 3, height: 40 }, // ground platform
  { x: 200, y: HEIGHT - 120, width: 100, height: 20 },
  { x: 400, y: HEIGHT - 180, width: 120, height: 20 },
  { x: 650, y: HEIGHT - 140, width: 80, height: 20 },
  { x: 800, y: HEIGHT - 100, width: 150, height: 20 },
];

let scrollX = 0;
const scrollSpeed = 5;

let gameOver = false;

function resetGame() {
  player.x = 50;
  player.y = HEIGHT - 80;
  player.vy = 0;
  player.onGround = false;
  scrollX = 0;
  gameOver = false;
  if(bgMusic.paused) bgMusic.play();
}

function update() {
  if (gameOver) return;

  // Move scroll
  scrollX += scrollSpeed;

  // Player physics
  player.vy += player.gravity;
  player.y += player.vy;

  // Platform collision detection
  player.onGround = false;
  for (const plat of platforms) {
    const platX = plat.x - scrollX;

    if (
      player.x + player.width > platX &&
      player.x < platX + plat.width &&
      player.y + player.height > plat.y &&
      player.y + player.height < plat.y + player.vy + player.gravity
    ) {
      player.y = plat.y - player.height;
      player.vy = 0;
      player.onGround = true;
    }
  }

  // Fall off screen = game over
  if (player.y > HEIGHT) {
    gameOver = true;
    bgMusic.pause();
  }
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Draw background
  ctx.fillStyle = '#121212';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Draw platforms
  ctx.fillStyle = '#444';
  for (const plat of platforms) {
    ctx.fillRect(plat.x - scrollX, plat.y, plat.width, plat.height);
  }

  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  if (gameOver) {
    ctx.fillStyle = '#FF5555';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', WIDTH / 2, HEIGHT / 2);
    ctx.font = '24px Arial';
    ctx.fillText('Click or Press Space to Restart', WIDTH / 2, HEIGHT / 2 + 40);
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function jump() {
  if (gameOver) {
    resetGame();
  } else if (player.onGround) {
    player.vy = player.jumpPower;
    player.onGround = false;
  }
}

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    jump();
  }
});
window.addEventListener('mousedown', jump);

// Start music and game
bgMusic.loop = true;
bgMusic.volume = 0.5;
bgMusic.play();

resetGame();
gameLoop();
