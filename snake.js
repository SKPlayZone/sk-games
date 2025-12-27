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

// 🍏 Food
let food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box,
};

// 🎮 Controls only when started
document.addEventListener("keydown", (e) => {
    if (!started) return;
    if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// 🐍 GAME LOOP
function drawGame() {
    ctx.fillStyle = "#0a1528";
    ctx.fillRect(0, 0, 400, 400);

    // 🍏 Food
    ctx.fillStyle = "#facc15";
    ctx.fillRect(food.x, food.y, box, box);

    // 🐍 Snake
    ctx.fillStyle = "#38bdf8";
    snake.forEach(s => ctx.fillRect(s.x, s.y, box, box));

    let head = { ...snake[0] };
    if (direction === "UP") head.y -= box;
    if (direction === "DOWN") head.y += box;
    if (direction === "LEFT") head.x -= box;
    if (direction === "RIGHT") head.x += box;

    // ⭐ FOOD EAT
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById("score").innerText = "Score: " + score;
        food = {
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box,
        };
    } else {
        snake.pop();
    }

    snake.unshift(head);

    // 💀 GAME OVER CHECK
    if (
        head.x < 0 || head.x >= 400 ||
        head.y < 0 || head.y >= 400 ||
        snake.slice(1).some(s => s.x === head.x && s.y === head.y)
    ) {
        clearInterval(gameInterval);

        // ❌ STOP MUSIC & PLAY OVER SOUND
        bgMusic.pause();
        bgMusic.currentTime = 0;
        gameOverSound.play();

        document.getElementById("finalScore").innerText = score;
        document.getElementById("gameOverPopup").classList.add("show");
    }
}

// 🚀 START GAME
function startGame() {
    if (started) return;
    started = true;

    gameInterval = setInterval(drawGame, 140);

    // 🎶 Start Music
    bgMusic.volume = 0.4;
    bgMusic.play();

    document.getElementById("startPopup").classList.remove("show");
}

// 🔄 RESTART GAME
function restartGame() {
    location.reload();
}
