let textures = {};

function initMap(){
    mapHeight = canvas.height - 400;
    mapWidth = canvas.width - 100;

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
            ["v","v","v","v","l","v","v","v","v","v","v","v","v","v","S","v","v","v","g","v","v","v","v","v","v","v","v","l"],
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
        "S": "./assets/textures/void.png"
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
    //console.log("Map drawn");
}




function initWalls(){
    tabObjWalls = new Array();
    var objWall = null;

    //Mur de gauche
    objWall = new Object();
    objWall.intXStart = 40;
    objWall.intYStart = 100;
    objWall.intXEnd = 50;
    objWall.intYEnd = objCanvas.height - 300;
    tabObjWalls.push(objWall);

    //Mur de droite
    objWall = new Object();
    objWall.intXStart = objCanvas.width - 50;
    objWall.intYStart = 100;
    objWall.intXEnd = objCanvas.width - 40;
    objWall.intYEnd = objCanvas.height - 300;
    tabObjWalls.push(objWall);

    //Mur du haut
    objWall = new Object();
    objWall.intXStart = 50;
    objWall.intYStart = 100;
    objWall.intXEnd = objCanvas.width - 50;
    objWall.intYEnd = 90;
    tabObjWalls.push(objWall);

    //Mur du bas
    objWall = new Object();
    objWall.intXStart = 50;
    objWall.intYStart = objCanvas.height - 300;
    objWall.intXEnd = objCanvas.width - 50;
    objWall.intYEnd = objCanvas.height - 290;
    tabObjWalls.push(objWall);
}

function drawWalls(){
    for(var i = 0; i < tabObjWalls.length; i++){
        var objWall = tabObjWalls[i];
        objC2D.fillStyle = "green";
        objC2D.fillRect(objWall.intXStart, objWall.intYStart, objWall.intXEnd - objWall.intXStart, objWall.intYEnd - objWall.intYStart);
    }
}