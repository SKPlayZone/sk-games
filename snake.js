const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const bgMusic = document.getElementById("bgMusic");
const gameOverSound = document.getElementById("gameOverSound");

const box = 20;
let snake = [{ x: 200, y: 200 }];
let direction = "RIGHT";
let score = 0;
let started = false;
let gameInterval;

let food = newFood();

// 🎮 Keyboard controls
document.addEventListener("keydown", e => {
  if (!started) return;
  if (e.key === "ArrowUp") move("UP");
  if (e.key === "ArrowDown") move("DOWN");
  if (e.key === "ArrowLeft") move("LEFT");
  if (e.key === "ArrowRight") move("RIGHT");
});

// 🎮 Mobile button control function
function move(dir){
  if (!started) return;
  if (dir === "UP" && direction !== "DOWN") direction = "UP";
  if (dir === "DOWN" && direction !== "UP") direction = "DOWN";
  if (dir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
  if (dir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
}

// 🍏 NEW FOOD
function newFood(){
  return {
    x: Math.floor(Math.random()*20)*box,
    y: Math.floor(Math.random()*20)*box
  };
}

// 🎮 GAME LOOP
function drawGame(){
  ctx.fillStyle = "#0a1528";
  ctx.fillRect(0,0,400,400);

  // food
  ctx.fillStyle = "#facc15";
  ctx.fillRect(food.x, food.y, box, box);

  // snake
  ctx.fillStyle = "#38bdf8";
  snake.forEach(s => ctx.fillRect(s.x, s.y, box, box));

  let head = {...snake[0]};
  if(direction==="UP") head.y -= box;
  if(direction==="DOWN") head.y += box;
  if(direction==="LEFT") head.x -= box;
  if(direction==="RIGHT") head.x += box;

  // EAT FOOD
  if(head.x===food.x && head.y===food.y){
    score++;
    document.getElementById("score").innerText = "Score: "+score;
    food = newFood();
  } else snake.pop();

  snake.unshift(head);

  // GAME OVER
  if(head.x<0||head.x>=400||head.y<0||head.y>=400||
    snake.slice(1).some(s=>s.x===head.x && s.y===head.y)){
      clearInterval(gameInterval);
      bgMusic.pause();
      gameOverSound.play();
      document.getElementById("finalScore").innerText = score;
      document.getElementById("gameOverPopup").classList.add("show");
  }
}

// 🚀 START GAME
function startGame(){
  if(started) return;
  started = true;
  bgMusic.volume = 0.4;
  bgMusic.play();
  gameInterval = setInterval(drawGame, 140);
  document.getElementById("startPopup").classList.remove("show");
}

// 🔄 RESTART
function restartGame(){ location.reload(); }
