var font = 'Press Start 2P'

function initUI(){
    objC2D.fillStyle = "orange";
    objC2D.fillRect(0, 0, objCanvas.width, objCanvas.height);

    var strText = "PAR ANDREI CRETU ET ALEXANDRU CIUCA";
    objC2D.font = "40px 'Press Start 2P'";
    objC2D.fillStyle = "black";
    objC2D.fillText(strText, objCanvas.width / 2 - objC2D.measureText(strText).width / 2, objCanvas.height  - 30);

    strText = "LODE RUNNER";
    objC2D.font = "40px 'Press Start 2P'";
    objC2D.fillStyle = "black";
    objC2D.fillText(strText, objCanvas.width / 2 - objC2D.measureText(strText).width / 2,  60);

    objC2D.fillRect(50,objCanvas.height - 300, objCanvas.width - 100, 200);
    
    //Score, temps, niveau et vies
    var score = "00000000";
    strText = "Score:" + score;
    objC2D.font = "35px 'Press Start 2P'"
    objC2D.fillStyle = "yellow";
    objC2D.fillText(strText, objCanvas.width / 5.8 - objC2D.measureText(strText).width / 2, objCanvas.height - 160); 
    

    temps = "00:00";
    strText = "Temps:" + temps;
    objC2D.font = "35px 'Press Start 2P'"
    objC2D.fillStyle = "yellow";
    objC2D.fillText(strText, objCanvas.width / 2.2 - objC2D.measureText(strText).width / 2, objCanvas.height - 160); 

    var niveau = 1;
    strText = "Niveau:" + niveau;
    objC2D.font = "35px 'Press Start 2P'"
    objC2D.fillStyle = "yellow";
    objC2D.fillText(strText, objCanvas.width / 1.47 - objC2D.measureText(strText).width / 2, objCanvas.height - 160);

    var vies = 5;
    strText = "Vies:" + vies;
    objC2D.font = "35px 'Press Start 2P'"
    objC2D.fillStyle = "yellow";
    objC2D.fillText(strText, objCanvas.width / 1.16 - objC2D.measureText(strText).width / 2, objCanvas.height - 160);
}