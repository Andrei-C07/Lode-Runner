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
        drawGuardHitBox(guard);
        objC2D.drawImage(guard.imgGuard, guard.guardintX, guard.guardintY);
    });
    objC2D.restore();
}

// Dessiner la boîte de collision des gardes
function drawGuardHitBox(guard) {
    objC2D.strokeStyle = "red";
    objC2D.strokeRect(guard.guardintX, guard.guardintY, guard.width, guard.height);
}

function getGuardBox(){
    return {
        left: guard.guardintX,
        right: guard.guardintX + guard.width,
        top: guard.guardintY,
        bottom: guard.guardintY + guard.height
    };
}

function guardPosOnMap() {
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

function updateGuards() {
        
    lstGuards.forEach(guard => {
        if(guard.state === "grounded" || guard.state === "traversingRope"){
            
        } 
    });
}

function eliminatePlayer(){
}