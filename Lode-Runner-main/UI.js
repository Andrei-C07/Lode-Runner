//var font = 'Press Start 2P'

function initUI(){
    strUIcolor = "orange";

    strMembers = "PAR ANDREI CRETU ET ALEXANDRU CIUCA";
    strTitle = "LODE RUNNER";
    strScore = "00000000";
    strTime = "00:00";
    strLvl = "1";
    strLives = "5";
}

function drawUI(){
    objC2D.fillStyle = strUIcolor;
    objC2D.fillRect(0, 0, objCanvas.width, objCanvas.height);

    objC2D.font = "40px 'Press Start 2P'";
    objC2D.fillStyle = "black";
    objC2D.fillText(strMembers, objCanvas.width / 2 - objC2D.measureText(strMembers).width / 2, objCanvas.height  - 30);

    objC2D.font = "40px 'Press Start 2P'";
    objC2D.fillStyle = "black";
    objC2D.fillText(strTitle, objCanvas.width / 2 - objC2D.measureText(strTitle).width / 2,  60);

    objC2D.fillRect(50,objCanvas.height - 300, objCanvas.width - 100, 200);
    
    //Score, temps, niveau et vies
    var strText = "Score:" + strScore;
    objC2D.font = "35px 'Press Start 2P'"
    objC2D.fillStyle = "yellow";
    objC2D.fillText(strText, objCanvas.width / 5.8 - objC2D.measureText(strText).width / 2, objCanvas.height - 160); 
    
    strText = "Temps:" + strTime;
    objC2D.font = "35px 'Press Start 2P'"
    objC2D.fillStyle = "yellow";
    objC2D.fillText(strText, objCanvas.width / 2.2 - objC2D.measureText(strText).width / 2, objCanvas.height - 160); 

    strText = "Niveau:" + strLvl;
    objC2D.font = "35px 'Press Start 2P'"
    objC2D.fillStyle = "yellow";
    objC2D.fillText(strText, objCanvas.width / 1.47 - objC2D.measureText(strText).width / 2, objCanvas.height - 160);

    strText = "Vies:" + strLives;
    objC2D.font = "35px 'Press Start 2P'"
    objC2D.fillStyle = "yellow";
    objC2D.fillText(strText, objCanvas.width / 1.16 - objC2D.measureText(strText).width / 2, objCanvas.height - 160);
}

