let timer = "00:00"; 
let timerInterval; 
let timeEnMarche = false;


function initUI(){
    strUIcolor = "orange";
    strMembers = "PAR ANDREI CRETU ET ALEXANDRU CIUCA";
    strTitle = "LODE RUNNER";
    strScore = "00000000";
    strTime = "00:00"; 
    strLvl = "1";
    strLives = "5";
}
//*****
//DEBUT FUNCTIONS TIMER
//*****
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

    objC2D.font = "35px 'Press Start 2P'"; 
    objC2D.fillStyle = "yellow"; 
    objC2D.fillText("Temps:" + timer, timerX + 20, timerY); 

    drawDynamicUI(); 
}
//*****
//FIN FUNCTIONS TIMER
//***** 
function drawStaticUI(){
    objC2D.fillStyle = strUIcolor;
    objC2D.fillRect(0, 0, objCanvas.width, objCanvas.height);

    objC2D.font = "40px 'Press Start 2P'";
    objC2D.fillStyle = "black";
    objC2D.fillText(strMembers, objCanvas.width / 2 - objC2D.measureText(strMembers).width / 2, objCanvas.height - 30);
    objC2D.fillText(strTitle, objCanvas.width / 2 - objC2D.measureText(strTitle).width / 2, 60);

    objC2D.fillRect(50, objCanvas.height - 300, objCanvas.width - 100, 200);
}

function drawDynamicUI(){
    objC2D.fillStyle = "black";
    objC2D.fillRect(50, objCanvas.height - 300, objCanvas.width - 100, 200);

    objC2D.font = "35px 'Press Start 2P'";
    objC2D.fillStyle = "yellow";

    let drawText = (text, x) => {
        objC2D.fillText(text, x - objC2D.measureText(text).width / 2, objCanvas.height - 160);
    };

    drawText("Score: " + strScore, objCanvas.width / 5.8);
    drawText("Temps: " + strTime, objCanvas.width / 2.2); 
    drawText("Niveau: " + strLvl, objCanvas.width / 1.47);
    drawText("Vies: " + strLives, objCanvas.width / 1.16);
}

function miseAJourScore(points){
    let scoreCourant = parseInt(strScore, 10);
    scoreCourant += points;
    strScore = scoreCourant.toString().padStart(8, "0");
    drawDynamicUI(); 
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { 
        startTimer();
    }
});
