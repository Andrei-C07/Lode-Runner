let textures = {};

function initMap(){
    // Use objCanvas (set in initAnimation) to determine map dimensions
    mapHeight = objCanvas.height - 400;
    mapWidth = objCanvas.width - 100;

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

    const textureFiles = {
        "v": "./assets/textures/void.png",
        "b": "./assets/textures/brick.png",
        "l": "./assets/textures/ladder.png",
        "r": "./assets/textures/rope.png",
        "p": "./assets/textures/pavement.png",
        "g": "./assets/textures/gold.png",
        "S": "./assets/textures/void.png",
        "h": "./assets/textures/void.png",
    };
    
    for (let key in textureFiles) {
        textures[key] = new Image();
        textures[key].src = textureFiles[key];
    }
    
    console.log("Textures initialized");
}

function drawMap() {
    const offsetX = 50;
    const offsetY = 100;
    objC2D.fillStyle = "black";
    objC2D.fillRect(offsetX, offsetY, objCanvas.width - 100, objCanvas.height - 400);

    const cellHeight = mapHeight / map.length;
    const cellWidth = mapWidth / map[0].length;

    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            let texture = textures[map[i][j]];
            if (texture && texture.complete) {
                objC2D.drawImage(texture, j * cellWidth + offsetX, i * cellHeight + offsetY, cellWidth, cellHeight);
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
    
    if (isOnRope()) {
        objPlayer.state = "traversingRope";
        return;
    }
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