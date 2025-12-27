const emojis = ["😀","😀","🐱","🐱","🚗","🚗","🍕","🍕","🎮","🎮","💎","💎","🎲","🎲","⚽","⚽"];
let shuffled = emojis.sort(() => Math.random() - 0.5);
const board = document.getElementById("gameBoard");

const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");

let first = null, second = null, lock = false, matched = 0;
const status = document.getElementById("status");

function startGame(){
  board.innerHTML = "";
  shuffled.forEach(emoji => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.emoji = emoji;
    card.textContent = "❓";
    card.addEventListener("click", flipCard);
    board.appendChild(card);
  });
}
startGame();

function flipCard(){
  if(lock || this.classList.contains("flipped")) return;

  clickSound.currentTime = 0;
  clickSound.play(); // 🔊 CLICK SOUND

  this.textContent = this.dataset.emoji;
  this.classList.add("flipped");

  if(!first) first = this;
  else {
    second = this;
    lock = true;

    if(first.dataset.emoji === second.dataset.emoji){
      matched += 2;
      first = second = null;
      lock = false;

      if(matched === emojis.length){
        status.textContent = "🎉 YOU WON THE GAME!";
        winSound.currentTime = 0;
        winSound.play(); // 🔊 WIN SOUND
        winCelebrate();
      }
    } else {
      setTimeout(()=>{
        first.textContent = "❓";
        second.textContent = "❓";
        first.classList.remove("flipped");
        second.classList.remove("flipped");
        first = second = null;
        lock = false;
      }, 800);
    }
  }
}

document.getElementById("restartBtn").addEventListener("click", ()=>{
  matched = 0;
  shuffled = emojis.sort(() => Math.random() - 0.5);
  status.textContent = "Find all the matching pairs!";
  startGame();
});

// 🎊 Celebration
function winCelebrate(){
  const duration = 2000;
  const end = Date.now() + duration;
  (function frame(){
    confetti({particleCount: 8, spread: 60, origin:{x:Math.random(), y:Math.random()}});
    if(Date.now() < end) requestAnimationFrame(frame);
  })();
}
