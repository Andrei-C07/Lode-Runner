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
    objPlayer.width = 40;
    objPlayer.height = 64;
    objPlayer.playerSpeed = 6.4;
    objPlayer.playerDirection = 0;
}

function drawPlayer(){
    objC2D.save();
    
    objC2D.drawImage(objPlayer.imgPlayer, objPlayer.playerIntX, objPlayer.playerIntY);
    objC2D.restore();
}

function movePlayer(){
    var binMoveableX = false;
    var binMoveableY = false;

    let { gridX, gridY } = playerPosOnMap();
    let currentTile = map[gridY] && map[gridY][gridX];
    let tileUnderPlayer = map[gridY + 1] && map[gridY + 1][gridX];
    
    switch (event.key) {
        case "ArrowRight" : // ->          
            binMoveableX = (objPlayer.playerIntX < objCanvas.width - 115);
            objPlayer.playerDirection = 1;
            break;
        case "ArrowLeft" : // <-
            binMoveableX = objPlayer.playerIntX > 50;
            objPlayer.playerDirection = -1;
            
            console.log("bouge gauche");
            break;
        case "ArrowUp" : // ^
            if (currentTile === "l" || (tileUnderPlayer === "l" && currentTile === "v" )) {
                binMoveableY = true;
                objPlayer.playerDirection = -1;
            }
            break;
        case "ArrowDown" : // v
            if ((currentTile === "l" || tileUnderPlayer === "l") && tileUnderPlayer !== "b"){
                binMoveableY = true;
                objPlayer.playerDirection = 1;
            }
            break;
            
    }

    if(tileUnderPlayer === "v"){
        if(tileUnderPlayer !== "b"){
            binMoveableX = false;
            objPlayer.playerDirection = 1;
            gravity();
        }
    }

    if(binMoveableX){
        erasePlayer();
        objPlayer.playerIntX += objPlayer.playerSpeed * objPlayer.playerDirection;
        redessinerMursMap();
        drawPlayer();
        checkGoldPickup();
    }

    if(binMoveableY){
        erasePlayer();
        objPlayer.playerIntY += objPlayer.playerSpeed * objPlayer.playerDirection ;
        redessinerMursMap();
        drawPlayer();
        checkGoldPickup();
    }
    console.log(objPlayer.playerIntX, objPlayer.playerIntY, gridX, gridY, currentTile);
    console.log(tileUnderPlayer);
}

function gravity(){
    erasePlayer();
    objPlayer.playerIntY += objPlayer.playerSpeed * objPlayer.playerDirection ;
    redessinerMursMap();
    drawPlayer();
}

function climb(){

}

function playerPosOnMap(){
    const offsetX = 25;
    const offsetY = 100;
    const cellHeight = mapHeight / map.length;
    const cellWidth = mapWidth / map[0].length;
    // console.log(cellHeight, cellWidth);

    let gridX = Math.floor((objPlayer.playerIntX - offsetX) / cellWidth);
    let gridY = Math.floor((objPlayer.playerIntY - offsetY) / cellHeight);

    return { gridX, gridY };
}

//redessiner les murs et la map car sinon le joueur laisse une trace et
//si tu redessine tout le canvas, le timer va reset a chaque mouvement 
function redessinerMursMap() {
    objC2D.save();
    objC2D.clearRect(objPlayer.playerIntX, objPlayer.playerIntY, objPlayer.width, objPlayer.height);
    drawMap(); 
    //drawWalls(); 
    objC2D.restore();
}

function checkGoldPickup(){
    let { gridX, gridY } = playerPosOnMap();

    if (map[gridY] && map[gridY][gridX] === "g") {

        map[gridY][gridX] = "v";
        miseAJourScore(250);
    }
}
