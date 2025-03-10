// Constants pour offset et collisions
const OFFSET_X = 50;
const OFFSET_Y = 100;

// PLAYER INITIALIZATION & DESSIN

function initPlayer() {
    objImgPlayer = new Image();
    objImgPlayer.src = "assets/player/playerIDLE.png";
    objPlayer = new Object();
    objPlayer.imgPlayer = objImgPlayer;
    const tileSize = 64;

    //initialiser le spawn du joueur
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] === "PS") {
                PspawnX = j * tileSize + OFFSET_X;
                PspawnY = i * tileSize + OFFSET_Y;
                break;
            }
        }
    }
    
    objPlayer.playerIntX = PspawnX;
    objPlayer.playerIntY = PspawnY;
    objPlayer.width = 64;
    objPlayer.height = 64;
    objPlayer.playerSpeed = 16;
    objPlayer.playerDirection = 0;
    objPlayer.playerState = "grounded";
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
        bottom: objPlayer.playerIntY + objPlayer.height,
        width: objPlayer.width,
        //height: objPlayer.height //maybe??
    };
}

//retourne la position du joueur sur la carte
function playerPosOnMap() {
    const tileWidth = mapWidth / map[0].length;
    const tileHeight = mapHeight / map.length;
    let gridX = Math.floor((objPlayer.playerIntX - OFFSET_X) / tileWidth);
    let gridY = Math.floor((objPlayer.playerIntY - OFFSET_Y) / tileHeight);
    //console.log(`Tile at (${gridX}, ${gridY}): ${map[gridY][gridX]}`);
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

function canDig(row, col) {
    if (map[row][col] !== "b") {
        //console.log("Pas une bricke.");
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
        //console.log("Ne peut pas creuser a lexterieure de la map.");
        return;
    }

    if (canDig(targetRow, targetCol)) {
        
        addHole(targetRow, targetCol);
    } else {
       //console.log("Ne peut pas creuser ici.");
    }
}

let holes = [];

function addHole(row, col) {
    holes.push({ row, col, timer: 8 * 1000 }); 
    map[row][col] = "h"; 
    //console.log(`Dug a hole at (${row}, ${col})`);
}

function updateHoles() {
    const intervalDuration = 100; 
    for (let i = holes.length - 1; i >= 0; i--) {
        holes[i].timer -= intervalDuration;
        //console.log(`Hole at (${holes[i].row}, ${holes[i].col}) has ${holes[i].timer}ms left`);
        if (holes[i].timer <= 0) {
            //console.log(`Filling hole at (${holes[i].row}, ${holes[i].col})`);
            map[holes[i].row][holes[i].col] = "b"; 
            holes.splice(i, 1); 
        }
    }
    dieInHole();
}
setInterval(updateHoles, 100);

/**
 * Fonction qui tue le joueur s'il tombe dans un trou
 * Explication : il fallait disable collisions + gravity quand le joueur est mort
 * et le + 70 dans la deuxieme condition est pour qu'on ne le voit pas floter a lexterieur de la map.
 */
function dieInHole() {
    
    if(isInBrick() && objPlayer.playerState !== "dead"){

        objPlayer.playerState = "dead";

        //Maybe dans une fonction differente :

        //quand le joueur meurt, il doit flotter vers le haut jsuqua ce que sa position soit plus
        //petite que le offset Y. Meme logique pour changer de niveau

        // ensuite mettre sa position a spawnX et spawnY
        let floatingSpeed = 5;
        let floatInterval = setInterval(() => {
            if (objPlayer.playerIntY + objPlayer.height > OFFSET_Y) {
                objPlayer.playerIntY -= floatingSpeed;
            } else {
                clearInterval(floatInterval);
                objPlayer.playerIntX = spawnX;
                objPlayer.playerIntY = spawnY;
                objPlayer.playerState = "grounded";
                strLives --;
            }
        }, 30);
    }
}




// -----------------
// KEY HANDLING 
// -----------------
function movePlayer() {
    let dx = 0;
    let dy = 0;

    if (objPlayer.playerState === "grounded" || objPlayer.playerState === "traversingRope") {
        switch(event.key) {
            case "ArrowRight":
                
                dx = objPlayer.playerSpeed;
                break;
            case "ArrowLeft":
                
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

function isInBrick(){
    let {gridX, gridY} = playerPosOnMap();
    if (objPlayer.playerState === "dead") return false;
    //console.log(`Tile at (${gridX}, ${gridY}): ${map[gridY][gridX]}`);
    if (map[gridY][gridX] === "b")
        return true;
    else 
        return false;
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
                //tu prends le centre de l'echelle et le centre du joueur
                let ladderCentre = OFFSET_X + col * tileWidth + tileWidth / 2; // + tileWidth / 2 obtient la position X du centre de lechelle
                let playerCentre = playerBox.left + playerBox.width / 2;
                //
                //si la distance entre les deux centres est inferieur a 10% de la largeur de la tuile
                if (Math.abs(ladderCentre - playerCentre) <= tileWidth * 0.1) {
                    return true;
                }
            }
        }
    }
    return false;
}
function addLadder() {
    
    let ladderRow = 3;
    let ladderCol = 18
    
    if (map[ladderRow][ladderCol] === "v") {
        for(let i = 0; i <= 5; i++){

            map[ladderRow - i][ladderCol] = "l"; 
            //.log("Une échelle est apparue à la position (" + ladderCol + ", " + ladderRow + ")");
        }
    } 
}
//check si joueur est sur rope
function isOnRope() {
    const playerBox = getPlayerBox();
    const tileWidth = mapWidth / map[0].length;
    const tileHeight = mapHeight / map.length;
    const sampleY = playerBox.bottom - 1; 
    const samplePoints = [
        { x: playerBox.left + 5, y: sampleY },
        { x: playerBox.left + playerBox.width / 2, y: sampleY },
        { x: playerBox.right - 5, y: sampleY }
    ];

    for (let point of samplePoints) {
        let gridX = Math.floor((point.x - OFFSET_X) / tileWidth);
        let gridY = Math.floor((point.y - OFFSET_Y) / tileHeight);
        if (gridY >= 0 && gridY < map.length && gridX >= 0 && gridX < map[0].length) {
            if (map[gridY][gridX] === "r") {  
               // console.log(objPlayer.height);
                let ropeTileBox = getTileBox(gridY, gridX);
            
                let desiredBottom = ropeTileBox.top + tileHeight / 1;
                let dy = desiredBottom - playerBox.bottom;
                objPlayer.playerIntY += dy;
               
                objPlayer.playerState = "traversingRope";
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

    if(objPlayer.playerState === "dead") return; //skip collision detection si joueur est mort

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
                //console.log("Next level!");
                for(i = 0; i <= 5; i++){
                    addLadder();
                  }
            }
        }
    }
}

function nextLevel() {
   // console.log("Transitioning to the next level!");
    strLvl++;
    resetTimer(); 
    map = [
        ["v","v","v","v","v","v","v","v","v","v","v","v","v","v","v","v","v","v","v","v","v","v","v","v","v","v","v","v"],
        ["v","v","v","v","g","v","v","v","v","v","v","v","v","v","v","v","v","v","v","v","v","v","v","v","v","v","v","v"],
        ["b","b","b","b","b","b","b","l","b","b","b","b","b","b","b","v","v","v","v","v","v","v","v","v","v","v","v","v"],
        ["v","v","v","v","v","v","v","l","r","r","r","r","r","r","r","r","r","r","v","v","v","v","v","g","v","v","v","v"],
        ["v","v","v","v","v","v","v","l","v","v","v","v","b","b","l","v","v","v","b","b","b","b","b","b","b","l","b","b"],
        ["v","v","v","v","v","v","v","l","v","v","v","v","b","b","l","v","v","v","v","v","v","v","v","v","v","l","v","v"],
        ["v","v","v","v","v","v","v","l","v","v","v","v","b","b","l","v","v","v","v","v","v","v","g","v","v","l","v","v"],
        ["b","b","l","b","b","b","b","b","v","v","v","v","b","b","b","b","b","b","b","b","l","b","b","b","b","b","b","b"],
        ["v","v","l","v","v","v","v","v","v","v","v","v","v","v","v","v","v","v","v","v","l","v","v","v","v","v","v","v"],
        ["v","v","l","v","v","v","v","v","v","v","v","v","v","v","v","v","v","v","v","v","l","v","v","v","v","v","v","v"],
        ["b","b","b","b","b","b","b","b","b","l","b","b","b","b","b","b","b","b","b","b","l","v","v","v","v","v","v","v"],
        ["v","v","v","v","v","v","v","v","v","l","v","v","v","v","v","v","v","v","v","v","l","v","v","v","v","v","v","v"],
        ["v","v","v","v","v","v","v","g","v","l","r","r","r","r","r","r","r","r","r","r","l","v","v","v","g","v","v","v"],
        ["v","v","v","v","l","b","b","b","b","b","b","v","v","v","v","v","v","v","v","v","b","b","b","b","b","b","b","l"],
        ["v","v","v","v","l","v","v","v","v","v","v","v","v","v","v","v","v","v","g","v","v","v","v","v","v","v","v","l"],
        ["b","b","b","b","b","b","b","b","b","b","b","b","b","b","b","b","b","b","b","b","b","b","b","b","b","b","b","b"],
        ["p","p","p","p","p","p","p","p","p","p","p","p","p","p","p","p","p","p","p","p","p","p","p","p","p","p","p","p"]
    ];
    objPlayer.playerIntX = spawnX;
    objPlayer.playerIntY = spawnY;
}

function checkLevelTransition() {

    if (isOnLadder() && objPlayer.playerIntY < OFFSET_Y) {
        nextLevel();
        miseAJourScore(1500);
    }
}


