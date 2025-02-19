function initUI(){
    objC2D.fillStyle = "orange";
    objC2D.fillRect(0, 0, objCanvas.width, objCanvas.height);

    var strText = "PAR ANDREI CRETU ET ALEXANDRU CIUCA";
    objC2D.font = "40px 'Press Start 2P'";
    objC2D.fillStyle = "black";
    objC2D.fillText(strText, objCanvas.width / 2 - objC2D.measureText(strText).width / 2, objCanvas.height  - objCanvas.height / 30);

    strText = "LODE RUNNER";
    objC2D.font = "40px 'Press Start 2P'";
    objC2D.fillStyle = "black";
    objC2D.fillText(strText, objCanvas.width / 2 - objC2D.measureText(strText).width / 2, objCanvas.height  - objCanvas.height + 60);


    objC2D.fillRect(50,objCanvas.height - 300, objCanvas.width - 100, 200);
}