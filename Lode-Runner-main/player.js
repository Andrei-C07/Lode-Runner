function initPlayer(){
    objImgPlayer = new Image();
    objImgPlayer.src = "assets/player/playerIDLE.png";
    objPlayer = new Object();
    //Onload pour executer la fonction draw() seulement quand l'image est chargée
    objImgPlayer.onload = function(){
        console.log("Player loaded");
        draw();
    };
    objPlayer.imgPlayer = objImgPlayer;
    objPlayer.playerIntX = spawnX;
    objPlayer.playerIntY = spawnY;
    objPlayer.playerSpeed = 10;
    objPlayer.playerDirection = 0;
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
        erasePlayer();
        objPlayer.playerIntX += objPlayer.playerSpeed * objPlayer.playerDirection;
        redessinerMursMap();
        drawPlayer();
    }

}
//redessiner les murs et la map car sinon le joueur laisse une trace et
//si tu redessine tout le canvas, le timer va reset a chaque mouvement 
function redessinerMursMap() {
    objC2D.save();
    objC2D.clearRect(objPlayer.playerIntX, objPlayer.playerIntY, objPlayer.width, objPlayer.height);
    drawMap(); 
    drawWalls(); 
    objC2D.restore();
}