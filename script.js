// 🔊 SOUNDS
const clickSound = document.getElementById("clickSound");
const drawSound = document.getElementById("drawSound");
const winSound = document.getElementById("winSound");

// 🎮 GAME ELEMENTS
const cells = document.querySelectorAll("[data-cell]");
const message = document.getElementById("message");
const restartButton = document.getElementById("restartButton");
const winBanner = document.getElementById("winBanner");

let currentPlayer = "X";
let gameActive = true;

// 📌 EVENT LISTENER
cells.forEach(cell => cell.addEventListener("click", handleClick, { once: true }));
restartButton.addEventListener("click", startGame);

// 📌 HANDLE PLAYER CLICK
function handleClick(e) {
  const cell = e.target;
  if (!gameActive || cell.textContent !== "") return;

  playMove(cell, "X");

  if (checkWin("X")) return endGame(false, "X");
  if (isDraw()) return endGame(true);

  currentPlayer = "O";
  setTimeout(computerMove, 500); // Delay = smart feeling
}

// 🤖 COMPUTER MOVE WITH AI
function computerMove() {
  if (!gameActive) return;

  const emptyCells = [...cells].filter(c => c.textContent === "");

  // 1️⃣ WIN if possible
  for (let cell of emptyCells) {
    cell.textContent = "O";
    if (checkWin("O")) {
      playSound(clickSound);
      return endGame(false, "O");
    }
    cell.textContent = "";
  }

  // 2️⃣ BLOCK X if needed
  for (let cell of emptyCells) {
    cell.textContent = "X";
    if (checkWin("X")) {
      cell.textContent = "O";
      playSound(clickSound);
      currentPlayer = "X";
      return;
    }
    cell.textContent = "";
  }

  // 3️⃣ ELSE RANDOM
  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  playMove(randomCell, "O");

  if (checkWin("O")) return endGame(false, "O");
  if (isDraw()) return endGame(true);

  currentPlayer = "X";
}

// 🎵 PLAY MOVE WITH SOUND
function playMove(cell, player) {
  cell.textContent = player;
  playSound(clickSound);
}

// 🎧 SOUND FUNCTION
function playSound(audio) {
  audio.currentTime = 0;
  audio.play();
}

// 🏆 CHECK WIN
function checkWin(p) {
  const win = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return win.some(pattern => pattern.every(i => cells[i].textContent === p));
}

// 👀 CHECK DRAW
function isDraw() {
  return [...cells].every(c => c.textContent !== "");
}

// 🔚 END GAME
function endGame(draw, winner) {
  gameActive = false;

  if (draw) {
    message.innerText = "🤝 It's a Draw!";
    playSound(drawSound);
  } else {
    message.innerText = `🎉 ${winner} Wins!`;
    playSound(winSound);
    showBanner(`${winner} WINS!`);
    confettiBlast();
  }

  cells.forEach(cell => cell.removeEventListener("click", handleClick));
}

// 🔁 RESTART GAME
function startGame() {
  currentPlayer = "X";
  gameActive = true;
  message.innerText = "";
  winBanner.classList.remove("show");

  cells.forEach(cell => {
    cell.textContent = "";
    cell.addEventListener("click", handleClick, { once: true });
  });
}

// 🎌 WIN BANNER
function showBanner(text) {
  winBanner.innerText = text;
  winBanner.classList.add("show");
  setTimeout(() => winBanner.classList.remove("show"), 3500);
}

// 🎆 CONFETTI
function confettiBlast() {
  let end = Date.now() + 1000;
  (function frame() {
    confetti({ particleCount: 10, spread: 70, origin: { x: 0 } });
    confetti({ particleCount: 10, spread: 70, origin: { x: 1 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
