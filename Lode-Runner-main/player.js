// Constants pour offset et collisions
const OFFSET_X = 50;
const OFFSET_Y = 100;
//const EXIT_TOLERANCE = 50;
//const LADDER_TOP_OFFSET = 20;

// PLAYER INITIALIZATION & DESSIN

function initPlayer() {
    objImgPlayer = new Image();
    objImgPlayer.src = "assets/player/playerIDLE.png";
    objPlayer = {};
    objImgPlayer.onload = function() {
        console.log("Player loaded");
        draw();
    };
    objPlayer.imgPlayer = objImgPlayer;
    objPlayer.playerIntX = spawnX;
    objPlayer.playerIntY = spawnY;
    objPlayer.width = 30;
    objPlayer.height = 64;
    objPlayer.playerSpeed = 8;
    objPlayer.playerDirection = 0;
    objPlayer.state = "grounded";
    objPlayer.fallingTimer = 0;
}

function drawPlayer() {
    objC2D.save();
    drawPlayerHitBox();
    objC2D.drawImage(objPlayer.imgPlayer, objPlayer.playerIntX, objPlayer.playerIntY);
    objC2D.restore();
}

// dessiner la boite de collision du joueur.
//Utile pour faire des tests.
function drawPlayerHitBox() {
    objC2D.strokeStyle = "red";
    objC2D.strokeRect(objPlayer.playerIntX, objPlayer.playerIntY, objPlayer.width, objPlayer.height);
}

//retourne la boite de collision du joueur
function getPlayerBox() {
    return {
        left: objPlayer.playerIntX,
        right: objPlayer.playerIntX + objPlayer.width,
        top: objPlayer.playerIntY,
        bottom: objPlayer.playerIntY + objPlayer.height
    };
}

//retourne la position du joueur sur la carte
function playerPosOnMap() {
    const tileWidth = mapWidth / map[0].length;
    const tileHeight = mapHeight / map.length;
    let gridX = Math.floor((objPlayer.playerIntX - OFFSET_X) / tileWidth);
    let gridY = Math.floor((objPlayer.playerIntY - OFFSET_Y) / tileHeight);
    return { gridX, gridY };
}

function getTileBox(row, col) {
    const tileWidth = mapWidth / map[0].length;
    const tileHeight = mapHeight / map.length;

    return {
        left: OFFSET_X + col * tileWidth,
        right: OFFSET_X + (col + 1) * tileWidth,
        top: OFFSET_Y + row * tileHeight,
        bottom: OFFSET_Y + (row + 1) * tileHeight
    };
}

//Determine si la tuile est solide
function estTuileSolide(tile) {
    return tile === "b" || tile === "p";
}

// -----------------
// KEY HANDLING & GRAVITY
// -----------------
function movePlayer() {
    let dx = 0;
    let dy = 0;

    if (objPlayer.state === "grounded" || objPlayer.fallingTimer < 100) {
        switch(event.key) {
            case "ArrowRight":
                //tryExitLadder("right");
                dx = objPlayer.playerSpeed;
                break;
            case "ArrowLeft":
                //tryExitLadder("left");
                dx = -objPlayer.playerSpeed;
                break;
            case "ArrowUp":   
                if (isOnLadder()) 
                    dy = -objPlayer.playerSpeed;
                break;
            case "ArrowDown":
                dy = objPlayer.playerSpeed;
                break;
        }
    }

    updatePlayerPosition(dx, dy);
    checkGoldPickup();
    
}

//regarde si le joueur est sur une echelle
//retourne true ou false
function isOnLadder() {
    let playerBox = getPlayerBox();
    const tileWidth = mapWidth / map[0].length;
    const tileHeight = mapHeight / map.length;
    
    let startCol = Math.floor((playerBox.left - OFFSET_X) / tileWidth);
    let endCol   = Math.floor((playerBox.right - OFFSET_X) / tileWidth);
    let startRow = Math.floor((playerBox.top - OFFSET_Y) / tileHeight);
    let endRow   = Math.floor((playerBox.bottom - OFFSET_Y) / tileHeight);
    
    startCol = Math.max(0, startCol);
    endCol = Math.min(map[0].length - 1, endCol);
    startRow = Math.max(0, startRow);
    endRow = Math.min(map.length - 1, endRow);
    
    for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
            if (map[row][col] === "l") {
                return true;
            }
        }
    }
    return false;

    // let { left, right, top, bottom } = getPlayerBox();
    // const tileWidth = mapWidth / map[0].length;
    // const tileHeight = mapHeight / map.length;

    // let startCol = Math.max(0, Math.floor((left - OFFSET_X) / tileWidth));
    // let endCol = Math.min(map[0].length - 1, Math.floor((right - OFFSET_X) / tileWidth));
    // let startRow = Math.max(0, Math.floor((top - OFFSET_Y) / tileHeight));
    // let endRow = Math.min(map.length - 1, Math.floor((bottom - OFFSET_Y) / tileHeight));

    // for (let row = startRow; row <= endRow; row++) {
    //     for (let col = startCol; col <= endCol; col++) {
    //         if (map[row][col] === "l") return true;
    //     }
    // }
    // return false;
}

//Check si deux boites de collision s'intersectent
//logique: retourne false si une de ses conditions est vraie
// Si le cote droit de r1 est a gauche du cote gauche de r2
// Si le cote gauche de r1 est a droite du cote droit de r2
// Si le cote bas de r1 est au dessus du cote haut de r2
// Si le cote haut de r1 est en dessous du cote bas de r2
//si aucune condition n'est vraie, les boites ne s'intersectent pas
function rectIntersect(r1, r2) {
    return !(r2.left >= r1.right ||
             r2.right <= r1.left ||
             r2.top >= r1.bottom ||
             r2.bottom <= r1.top);
}

//ajuste la position du joueur pour resoudre les collisions horizontales si la boite du joueur
//s'intersect avec une tuile solide
function resolveHorizontalCollisions() {
    let playerBox = getPlayerBox();
    const tileWidth = mapWidth / map[0].length;
    const tileHeight = mapHeight / map.length;
    
    let startCol = Math.floor((playerBox.left - OFFSET_X) / tileWidth);
    let endCol   = Math.floor((playerBox.right - OFFSET_X) / tileWidth);
    let startRow = Math.floor((playerBox.top - OFFSET_Y) / tileHeight);
    let endRow   = Math.floor((playerBox.bottom - OFFSET_Y) / tileHeight);
    
    startCol = Math.max(0, startCol);
    endCol = Math.min(map[0].length - 1, endCol);
    startRow = Math.max(0, startRow);
    endRow = Math.min(map.length - 1, endRow);
    
    for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
            if (estTuileSolide(map[row][col])) {
                let tileBox = getTileBox(row, col);
                if (rectIntersect(playerBox, tileBox)) {
                    let penetrationLeft = playerBox.right - tileBox.left;
                    let penetrationRight = tileBox.right - playerBox.left;
                    if (penetrationLeft < penetrationRight) {
                        objPlayer.playerIntX -= penetrationLeft;
                    } else {
                        objPlayer.playerIntX += penetrationRight;
                    }
                    playerBox = getPlayerBox();
                }
            }
        }
    }
}

//ajuste la position du joueur pour resoudre les collisions verticales si la boite du joueur
//s'intersect avec une tuile solide
function resolveVerticalCollisions() {
    let playerBox = getPlayerBox();
    const tileWidth = mapWidth / map[0].length;
    const tileHeight = mapHeight / map.length;
    
    let startCol = Math.floor((playerBox.left - OFFSET_X) / tileWidth);
    let endCol   = Math.floor((playerBox.right - OFFSET_X) / tileWidth);
    let startRow = Math.floor((playerBox.top - OFFSET_Y) / tileHeight);
    let endRow   = Math.floor((playerBox.bottom - OFFSET_Y) / tileHeight);
    
    startCol = Math.max(0, startCol);
    endCol = Math.min(map[0].length - 1, endCol);
    startRow = Math.max(0, startRow);
    endRow = Math.min(map.length - 1, endRow);
    
    for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
            if (estTuileSolide(map[row][col])) {
                let tileBox = getTileBox(row, col);
                if (rectIntersect(playerBox, tileBox)) {
                    let penetrationTop = playerBox.bottom - tileBox.top;
                    let penetrationBottom = tileBox.bottom - playerBox.top;
                    if (penetrationTop < penetrationBottom) {
                        objPlayer.playerIntY -= penetrationTop;
                    } else {
                        objPlayer.playerIntY += penetrationBottom;
                    }
                    playerBox = getPlayerBox();
                }
            }
        }
    }
}

//met a jour la position du joueur en fonction de dx et dy
function updatePlayerPosition(dx, dy) {

    let newX = objPlayer.playerIntX + dx;

    if (newX < OFFSET_X) {
        newX = OFFSET_X;
    }

    const mapRightBoundary = OFFSET_X + mapWidth - objPlayer.width;
    if (newX > mapRightBoundary) {
        newX = mapRightBoundary;
    }

    objPlayer.playerIntX = newX;
    resolveHorizontalCollisions();

    objPlayer.playerIntY += dy;
    resolveVerticalCollisions();
}

//retourne la position du joueur en bas au centre sur la carte
function playerBottomCenterPosOnMap() {
    const tileWidth = mapWidth / map[0].length;
    const tileHeight = mapHeight / map.length;
    let centerX = objPlayer.playerIntX + objPlayer.width / 2;
    let bottomY = objPlayer.playerIntY + objPlayer.height;
    let gridX = Math.floor((centerX - OFFSET_X) / tileWidth);
    let gridY = Math.floor((bottomY - OFFSET_Y) / tileHeight);
    return { gridX, gridY };
}

//regarde si le joueur est sur une piece d'or et la ramasse
function checkGoldPickup() {
    let { gridX, gridY } = playerPosOnMap();
    if (gridY >= 0 && gridY < map.length && gridX >= 0 && gridX < map[gridY].length) {
        if (map[gridY][gridX] === "g") {
            map[gridY][gridX] = "v";
            miseAJourScore(250);
            intGold++;
            if (intGold % 6 === 0) {
                console.log("Next level!");
            }
        }
    }
}

//Appliquer gravite si le joueur n'est pas sur une echelle
function applyGravity() {
    let bottomPos = playerBottomCenterPosOnMap();
    const FALLING_DELAY = 100; 

    if (map[bottomPos.gridY][bottomPos.gridX] !== "l" && !estTuileSolide(map[bottomPos.gridY][bottomPos.gridX])) {
        objPlayer.fallingTimer += 20; 

        if (objPlayer.fallingTimer >= FALLING_DELAY) {
            objPlayer.state = "falling";
            updatePlayerPosition(0, 4);
        }
    } else {
        objPlayer.fallingTimer = 0;
        objPlayer.state = "grounded";
    }
}
setInterval(applyGravity, 20);



//regarde si le joueur est sur une echelle et essaie de sortir
// function tryExitLadder(direction) {
//     // 1- si le joueur n'est pas sur une echelle, on ne fait rien
//     if (!isOnLadder()) return;

//     // 2- determine si on est sur la derniere echelle
//     let { gridX, gridY } = playerBottomCenterPosOnMap();
//     // si il y a un element L en haut de la tuile actuelle, on ne peut pas sortir
//     if (gridY > 0 && map[gridY - 1][gridX] === "l") {
//         return;
//     }

//     // 3- check horizontallement dans la direction ou le joueur veut aller
//     let nextGridX = direction === "right" ? gridX + 1 : gridX - 1;
//     if (nextGridX < 0 || nextGridX >= map[0].length) return;    

//     // // 4- si la tuile a cote est solide, snap les pieds a la tuile
//     // if (estTuileSolide(map[gridY][nextGridX])) {
//     //     let tileBox = getTileBox(gridY, nextGridX);
//     //     objPlayer.playerIntY = tileBox.top - objPlayer.height;
//     // }
//     else {
//         // 5- si la tuile est pas solide, check si la tuile en haut est solide
//         //   si la tuile a (gridY-1, nextGridX) est solide, snap a celle la.
//         if (gridY > 0 && estTuileSolide(map[gridY - 1][nextGridX])) {
//             let tileBox = getTileBox(gridY - 1, nextGridX);
//             objPlayer.playerIntY = tileBox.top - objPlayer.height;
//         }
//     }
// }

