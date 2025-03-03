let timer = "00:00";
let timerInterval;

function resetTimer() {
  timer = "00:00";
  strTime = timer;
  clearInterval(timerInterval);
  timeEnMarche = false;
  updateUITimer();
}

function startTimer() {
  if (timeEnMarche) return;
  timeEnMarche = true;
  let minutes = 0;
  let seconds = 0;

  timerInterval = setInterval(() => {
    seconds++;
    if (seconds === 60) {
      seconds = 0;
      minutes++;
    }

    timer = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    strTime = timer;
    updateUITimer();
  }, 1000);
}

function updateUITimer() {
  const timerX = objCanvas.width / 2.5 - 112;
  const timerY = objCanvas.height - 160;
  const timerWidth = 500;
  const timerHeight = 50;

  objC2D.fillStyle = "black";
  objC2D.fillRect(timerX, timerY - 35, timerWidth, timerHeight);

  // Redessine le timer
  objC2D.font = "35px 'Press Start 2P'";
  objC2D.fillStyle = "yellow";
  objC2D.fillText("Temps:" + timer, timerX + 20, timerY);
  drawDynamicUI();
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { 
    startTimer();
  }
});