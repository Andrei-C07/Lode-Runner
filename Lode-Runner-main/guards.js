class Guard {
    constructor(x, y, img) {
        this.imgGuard = img;
        this.guardintX = x;
        this.guardintY = y;
        this.width = 64;
        this.height = 64;
        this.guardSpeed = 1.5;
        this.guardDirection = 0;
        this.guardState = "freeze";
        this.fallingTimer = 0;
        this.hasgold = false;
    }
}

// Initialisation des gardes
let lstGuards;

function initGuard() {
    objImgGuard = new Image();
    objImgGuard.src = "assets/guards/guardIDLE.png";

    lstGuards = [];

    //trouver des spawns pour les gardes
    //exclure la passerelle sur laquelle se trouve le joueur
    let playerLevel = Math.floor((objPlayer.playerIntY - OFFSET_Y) / 64);
    let guardSpawnPoints = [];

    for (let i = 0; i < map.length; i++) {
        if (i === playerLevel) continue; 
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] === "v" && map[i  + 1][j] === "b") { 
                guardSpawnPoints.push({ x: j, y: i });
            }
        }
    }

    for (let i = 0; i < numGuards; i++) {

        let randomIndex = Math.floor(Math.random() * guardSpawnPoints.length);
        let { x, y } = guardSpawnPoints[randomIndex];

        let GspawnX = x * 64 + OFFSET_X;
        let GspawnY = y * 64 + OFFSET_Y;

        lstGuards.push(new Guard(GspawnX, GspawnY, objImgGuard));
        guardSpawnPoints.splice(randomIndex, 1);
    }
}


// Dessin des gardes
function drawGuard() {
    objC2D.save();
    lstGuards.forEach(guard => {
        //drawGuardHitBox(guard);
        objC2D.drawImage(guard.imgGuard, guard.guardintX, guard.guardintY);
    });
    objC2D.restore();
}

// Dessiner la boîte de collision des gardes
function drawGuardHitBox(guard) {
    objC2D.strokeStyle = "red";
    objC2D.strokeRect(guard.guardintX, guard.guardintY, guard.width, guard.height);
}

function getGuardBox(guard) {
    return {
        left: guard.guardintX,
        right: guard.guardintX + guard.width,
        top: guard.guardintY,
        bottom: guard.guardintY + guard.height
    };
}

function guardPosOnMap(guard) {
    const tileWidth = mapWidth / map[0].length;
    const tileHeight = mapHeight / map.length;
    let gridX = Math.floor((guard.guardintX - OFFSET_X) / tileWidth);
    let gridY = Math.floor((guard.guardintY - OFFSET_Y) / tileHeight);
    return { gridX, gridY };
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { 
        lstGuards.forEach(guard => {
            guard.guardState = "grounded";
        });
    }
});


//INCOMPLET
//GRAVITE PAS BONNE
//sanp sur echelle a reparer
//ne suis pas bien le joueur
//si garde dans un trou et la brique apparait le juex crash.
//garde ne drop pas l'or
//garde ne peut pas monter les echelles au complet

function updateGuards() {
    lstGuards.forEach(guard => {
        if (guard.guardState === "freeze") return;

        let { gridX: guardX, gridY: guardY } = guardPosOnMap(guard);
        let { gridX: playerX, gridY: playerY } = playerPosOnMap();

        let moveX = 0, moveY = 0;

        if (guardX < playerX) {
            moveX = guard.guardSpeed; 
        } else if (guardX > playerX) {
            moveX = -guard.guardSpeed; 
        }

        
        let newGuardX = guard.guardintX + moveX;
        let newGridX = Math.floor((newGuardX - OFFSET_X) / (mapWidth / map[0].length));

        if (!estTuileSolide(map[guardY][newGridX])) {
            guard.guardintX = newGuardX;
        }

        
        if (guardX === playerX) {
            if (guardY < playerY && map[guardY + 1][guardX] === "l") {
                moveY = guard.guardSpeed;  
            } else if (guardY > playerY && map[guardY - 1][guardX] === "l") {
                moveY = -guard.guardSpeed; 
            }
        }

        
        let newGuardY = guard.guardintY + moveY;
        let newGridY = Math.floor((newGuardY - OFFSET_Y) / (mapHeight / map.length));

        if (!estTuileSolide(map[newGridY][guardX])) {
            guard.guardintY = newGuardY;
        }

        
        let belowTile = map[guardY + 1] && map[guardY + 1][guardX];
        if (!estTuileSolide(belowTile) && belowTile !== "l") {
            guard.guardintY += 2; 
        }
        checkGoldGuard();
        
        resolveHorizontalCollisionsGuards();
        resolveVerticalCollisionsGuards();
    });
}


//PROBLEME : le joueur ne peut passer au prochaion niveau car le garde ne drop pas l'or
function checkGoldGuard() {
    lstGuards.forEach(guard => {
        let { gridX, gridY } = guardPosOnMap(guard);

        if (gridY >= 0 && gridY < map.length && gridX >= 0 && gridX < map[gridY].length) {
            if (map[gridY][gridX] === "g") {
                map[gridY][gridX] = "v";
                guard.hasgold = true;
            }
        }
    });
}

//ajuste la position du joueur pour resoudre les collisions horizontales si la boite du joueur
//s'intersect avec une tuile solide
function resolveHorizontalCollisionsGuards() {
    lstGuards.forEach(guard => {
    let guardBox = getGuardBox(guard);
    const tileWidth = mapWidth / map[0].length;
    const tileHeight = mapHeight / map.length;
    
    let startCol = Math.floor((guardBox.left - OFFSET_X) / tileWidth);
    let endCol   = Math.floor((guardBox.right - OFFSET_X) / tileWidth);
    let startRow = Math.floor((guardBox.top - OFFSET_Y) / tileHeight);
    let endRow   = Math.floor((guardBox.bottom - OFFSET_Y) / tileHeight);
    
    startCol = Math.max(0, startCol);
    endCol = Math.min(map[0].length - 1, endCol);
    startRow = Math.max(0, startRow);
    endRow = Math.min(map.length - 1, endRow);
    
    for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
            if (estTuileSolide(map[row][col])) {
                let tileBox = getTileBox(row, col);
                if (rectIntersect(guardBox, tileBox)) {
                    let penetrationLeft = guardBox.right - tileBox.left;
                    let penetrationRight = tileBox.right - guardBox.left;
                    if (penetrationLeft < penetrationRight) {
                        guard.guardintX = tileBox.left - guard.width;  
                    } else {
                        guard.guardintX = tileBox.right;  
                    }
                }
            }
        }
        guardBox = getGuardBox(guard);
    }});
}

//ajuste la position du joueur pour resoudre les collisions verticales si la boite du joueur
//s'intersect avec une tuile solide
function resolveVerticalCollisionsGuards() {
    lstGuards.forEach(guard => {
        let guardBox = getGuardBox(guard);
        const tileWidth = mapWidth / map[0].length;
        const tileHeight = mapHeight / map.length;
        
        let startCol = Math.floor((guardBox.left - OFFSET_X) / tileWidth);
        let endCol   = Math.floor((guardBox.right - OFFSET_X) / tileWidth);
        let startRow = Math.floor((guardBox.top - OFFSET_Y) / tileHeight);
        let endRow   = Math.floor((guardBox.bottom - OFFSET_Y) / tileHeight);
        
        startCol = Math.max(0, startCol);
        endCol = Math.min(map[0].length - 1, endCol);
        startRow = Math.max(0, startRow);
        endRow = Math.min(map.length - 1, endRow);
        
        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                if (estTuileSolide(map[row][col])) {
                    let tileBox = getTileBox(row, col);
                    if (rectIntersect(guardBox, tileBox)) {
                        let penetrationTop = guardBox.bottom - tileBox.top;
                        let penetrationBottom = tileBox.bottom - guardBox.top;
                        if (penetrationTop < penetrationBottom) {
                            guard.guardintY -= penetrationTop;
                        } else {
                            guard.guardintY += penetrationBottom;
                        }
                        guardBox = getGuardBox(guard);
                    }
                }
            }
        }
    });
    
}