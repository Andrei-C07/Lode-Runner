//initialiser le joueur
function initPlayer(){
    objImgPlayer = new Image();
    objImgPlayer.src = "assets/player/playerIDLE.png";
    objPlayer = new Object();
    objImgPlayer.onload = function(){
        console.log("Player loaded");
        draw();
    };
    objPlayer.imgPlayer = objImgPlayer;
    objPlayer.playerIntX = spawnX;
    objPlayer.playerIntY = spawnY;
    objPlayer.width = 30;
    objPlayer.height = 64;
    objPlayer.playerSpeed = 6.4;
    objPlayer.playerDirection = 0;
}

//Dessiner le joueur
function drawPlayer(){
    objC2D.save();
    drawPlayerHitBox();
    objC2D.drawImage(objPlayer.imgPlayer, objPlayer.playerIntX, objPlayer.playerIntY);
    objC2D.restore();
}

//Faire bouger le joueur
function movePlayer(){
    let binMoveLeft = false;
    let binMoveRight = false;
    let binMoveUp = false;
    let binMoveDown = false;
    let gravitySpeed = 4;

    switch (event.key) {
        case "ArrowRight" : // ->          
            binMoveRight = true
            objPlayer.playerDirection = 1;
            break;
        case "ArrowLeft" : // <-
            binMoveLeft = true;
            objPlayer.playerDirection = -1;
            break;
        case "ArrowUp" : // ^
            binMoveUp = true;
            objPlayer.playerDirection = -1;
            break;
        case "ArrowDown" : // v
            binMoveDown = true;
            objPlayer.playerDirection = 1;
            break;
            
    }

    if(binMoveRight){
        objPlayer.playerIntX += objPlayer.playerSpeed;
    }
    if(binMoveLeft){
        objPlayer.playerIntX -= objPlayer.playerSpeed;
    }
    if(binMoveUp){
        objPlayer.playerIntY -= objPlayer.playerSpeed;
    }
    if(binMoveDown){
        objPlayer.playerIntY += objPlayer.playerSpeed;
    }

    checkGoldPickup();
}

//Voir les limites de Runner. Utile pour les tests
function drawPlayerHitBox() {
    objC2D.strokeStyle = "red";
    objC2D.strokeRect(objPlayer.playerIntX, objPlayer.playerIntY, objPlayer.width, objPlayer.height);
}

// function binGravity(){
//     if (tileBelow === "v") {
//         return true
//     }
//     return false
// }


// function movePlayer1() {
//     let binMoveLeft = false;
//     let binMoveRight = false;
//     let binMoveUp = false;
//     let binMoveDown = false;
//     let gravitySpeed = 4;

//     window.addEventListener("keydown", function (event) {
//         switch (event.key) {
//             case "ArrowLeft":
//                 binMoveLeft = true;
//                 break;
//             case "ArrowRight":
//                 binMoveRight = true;
//                 break;
//             case "ArrowUp":
//                 binMoveUp = true;
//                 break;
//             case "ArrowDown":
//                 binMoveDown = true;
//                 break;
//         }
//     });

//     let cellWidth = mapWidth / map[0].length;
//     let cellHeight = mapHeight / map.length;

//     let col = Math.floor((objPlayer.playerIntX + objPlayer.width / 2) / cellWidth);
//     let row = Math.floor((objPlayer.playerIntY + objPlayer.height) / cellHeight);

//     let tileCurrent = map[row][col];
//     let tileBelow = row + 1 < map.length ? map[row + 1][col] : "b";
//     let tileAbove = row - 1 >= 0 ? map[row - 1][col] : "b";
//     let tileLeft = col - 1 >= 0 ? map[row][col - 1] : "b";
//     let tileRight = col + 1 < map[0].length ? map[row][col + 1] : "b";

//     let speed = objPlayer.playerSpeed;
    
//     if (tileBelow === "v") {
//         objPlayer.playerIntY += gravitySpeed;
//     }

//     if (binMoveLeft && tileLeft !== "b") objPlayer.playerIntX -= speed;
//     if (binMoveRight && tileRight !== "b") objPlayer.playerIntX += speed;
//     if (binMoveUp && (tileCurrent === "l" || tileAbove === "l")) objPlayer.playerIntY -= speed;
//     if (binMoveDown && tileBelow !== "b") objPlayer.playerIntY += speed;
// }
function playerPosOnMap() {
    const offsetX = 50;
    const offsetY = 100; 
    const tileWidth = mapWidth / map[0].length; 
    const tileHeight = mapHeight / map.length; 

    let gridX = Math.floor((objPlayer.playerIntX - offsetX) / tileWidth);
    let gridY = Math.floor((objPlayer.playerIntY - offsetY) / tileHeight);

    return { gridX, gridY };
}
function checkGoldPickup() {
    let { gridX, gridY } = playerPosOnMap();

    if (gridY >= 0 && gridY < map.length && gridX >= 0 && gridX < map[gridY].length) {
        if (map[gridY][gridX] === "g") {
            map[gridY][gridX] = "v";

            miseAJourScore(250);
            intGold++;
            if(intGold % 6 == 0){
                console.log("next lvl");
            }
        }
    }
}