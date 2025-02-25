function initUI(){
    strUIcolor = "orange";

    strMembers = "PAR ANDREI CRETU ET ALEXANDRU CIUCA";
    strTitle = "LODE RUNNER";
    strScore = "00000000";
    strTime = "00:00";
    strLvl = "1";
    strLives = "5";

}

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
