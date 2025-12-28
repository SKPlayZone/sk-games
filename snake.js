const cvs = document.getElementById("gameCanvas");
const ctx = cvs.getContext("2d");

let box = 20;
let snake = [{ x: 200, y: 200 }];
let food = randomFood();
let dir = "RIGHT";
let score = 0;
let started = false;
let game;

const music = document.getElementById("bgMusic");
const over = document.getElementById("gameOverSound");

// RANDOM FOOD
function randomFood(){
  return {
    x: Math.floor(Math.random()*20)*box,
    y: Math.floor(Math.random()*20)*box
  }
}

// KEYBOARD CONTROLS
document.addEventListener("keydown", e=>{
  if(!started) return;
  if(e.key==="ArrowUp" && dir!=="DOWN") dir="UP";
  if(e.key==="ArrowDown" && dir!=="UP") dir="DOWN";
  if(e.key==="ArrowLeft" && dir!=="RIGHT") dir="LEFT";
  if(e.key==="ArrowRight" && dir!=="LEFT") dir="RIGHT";
});

// MOBILE BUTTON CONTROL
document.getElementById("up").onclick = ()=>{if(dir!=="DOWN") dir="UP"};
document.getElementById("down").onclick = ()=>{if(dir!=="UP") dir="DOWN"};
document.getElementById("left").onclick = ()=>{if(dir!=="RIGHT") dir="LEFT"};
document.getElementById("right").onclick = ()=>{if(dir!=="LEFT") dir="RIGHT"};

// GAME ENGINE
function gameLoop(){
  ctx.fillStyle="#0a1528";
  ctx.fillRect(0,0,400,400);

  ctx.fillStyle="#facc15";
  ctx.fillRect(food.x,food.y,box,box);

  for(let s of snake){
    ctx.fillStyle="#38bdf8";
    ctx.fillRect(s.x,s.y,box,box);
  }

  let head = {...snake[0]};
  if(dir==="UP") head.y -= box;
  if(dir==="DOWN") head.y += box;
  if(dir==="LEFT") head.x -= box;
  if(dir==="RIGHT") head.x += box;

  if(head.x===food.x && head.y===food.y){
    score++;
    document.getElementById("score").innerText="Score: "+score;
    food = randomFood();
  } else snake.pop();

  snake.unshift(head);

  // GAME OVER CHECK
  if(head.x<0 || head.x>=400 || head.y<0 || head.y>=400 ||
     snake.slice(1).some(s=>s.x===head.x && s.y===head.y)){
    clearInterval(game);
    music.pause();
    over.play();
    document.getElementById("finalScore").innerText = score;
    document.getElementById("gameOverPopup").classList.add("show");
  }
}

// START
function startGame(){
  if(started) return;
  started=true;
  music.volume=0.4;
  music.play();
  document.getElementById("startPopup").classList.remove("show");
  game=setInterval(gameLoop,130);
}

// RESTART
function restartGame(){ location.reload(); }
