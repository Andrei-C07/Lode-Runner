function initPlayer(){
    objImgPlayer = new Image();
    objImgPlayer.src = "assets/player/playerIDLE.png";
    objPlayer = new Object();

    objPlayer.imgPlayer = objImgPlayer;
    objPlayer.playerIntX = spawnX;
    objPlayer.playerIntY = spawnY;
    objPlayer.playerSpeed = 10;
    objPlayer.playerDirection = 0;

    console.log("Player initialized");
}

function drawPlayer(){
    objC2D.save();
    objC2D.drawImage(objPlayer.imgPlayer, objPlayer.playerIntX, objPlayer.playerIntY);
    objC2D.restore();
}

function movePlayer(){
    var binMoveable = true;
    switch (event.keyCode) {
        case 39 : // ->
            objPlayer.playerDirection = 1;
            console.log("bouge droite");
            break;
        case 37 : // <-
            objPlayer.playerDirection = -1;
            
            console.log("bouge gauche");
            break;
    }

    if(binMoveable){
        objPlayer.playerIntX += objPlayer.playerSpeed * objPlayer.playerDirection;
    }
}