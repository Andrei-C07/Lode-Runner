// Constants pour offset et collisions
const OFFSET_X = 50;
const OFFSET_Y = 100;

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
    objPlayer.width = 64;
    objPlayer.height = 64;
    objPlayer.playerSpeed = 32;
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
    console.log(`Player grid position: (${gridX}, ${gridY})`);
    console.log(`Tile at (${gridX}, ${gridY}): ${map[gridY][gridX]}`);
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

let holes = [];

function addHole(row, col) {
    holes.push({ row, col, timer: 8 * 1000 }); 
    map[row][col] = "h"; 
    console.log(`Dug a hole at (${row}, ${col})`);
}

function updateHoles() {
    const intervalDuration = 100; 
    for (let i = holes.length - 1; i >= 0; i--) {
        holes[i].timer -= intervalDuration;
        console.log(`Hole at (${holes[i].row}, ${holes[i].col}) has ${holes[i].timer}ms left`);
        if (holes[i].timer <= 0) {
            console.log(`Filling hole at (${holes[i].row}, ${holes[i].col})`);
            map[holes[i].row][holes[i].col] = "b"; 
            holes.splice(i, 1); 
        }
    }
}
setInterval(updateHoles, 100);


function canDig(row, col) {
    if (map[row][col] !== "b") {
        console.log("Pas une bricke.");
        return false; 
    }
    if (row > 0 && map[row - 1][col] !== "v") {
        return false; 
    }
    return true;
}
function digHole(direction) {
    let { gridX, gridY } = playerPosOnMap();
    let targetCol = direction === 'right' ? gridX + 1 : gridX - 1;
    let targetRow = gridY + 1; 

    
    if (targetCol < 0 || targetCol >= map[0].length || targetRow < 0 || targetRow >= map.length) {
        console.log("Ne peut pas creuser a lexterieure de la map.");
        return;
    }

    if (canDig(targetRow, targetCol)) {
        
        addHole(targetRow, targetCol);
    } else {
        console.log("Ne peut pas creuser ici.");
    }
}

// -----------------
// KEY HANDLING & GRAVITY
// -----------------
function movePlayer() {
    let dx = 0;
    let dy = 0;

    if (objPlayer.state === "grounded") {
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
            case "x":
                digHole("right");
                break;
            case "z":
                digHole("left");
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
    //console.log(gridX, gridY);
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
//
function applyGravity() {
    const playerBox = getPlayerBox();
    const tileWidth = mapWidth / map[0].length;
    const tileHeight = mapHeight / map.length;
    
    //definir sample points gauch centre et droite du joueur
    const samplePoints = [
        { x: playerBox.left + 1, y: playerBox.bottom },
        { x: playerBox.left + playerBox.width / 2, y: playerBox.bottom },
        { x: playerBox.right - 1, y: playerBox.bottom }
    ];
    
    let grounded = false;
    
    for (let point of samplePoints) {
        let gridX = Math.floor((point.x - OFFSET_X) / tileWidth);
        let gridY = Math.floor((point.y - OFFSET_Y) / tileHeight);
        
        if (gridY >= 0 && gridY < map.length && gridX >= 0 && gridX < map[0].length) {
            if (map[gridY][gridX] === "l" || estTuileSolide(map[gridY][gridX])) {
                grounded = true;
                break;
            }
        }
    }
    
    if (!grounded) {
        updatePlayerPosition(0, 8);
        objPlayer.state = "falling";
    } else {
        objPlayer.state = "grounded";
    }
}
setInterval(applyGravity, 20);

