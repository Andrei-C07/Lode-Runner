    function initMap(){
        
        mapHeight = canvas.height - 400;
        mapWidth = canvas.width - 100;

        // v = void
        // b = brick
        // l = ladder
        // r = rope
        // p = pavement
        // g = gold
        // S = spawn


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
          
}

function drawMap(){
    const offsetX = 50;
    const offsetY = 100; 

    objC2D.fillStyle = "black";
    objC2D.fillRect(offsetX, offsetY, objCanvas.width - 100, objCanvas.height - 400);

    const voidTexture = new Image();
    voidTexture.src = "./assets/textures/void.png";

    voidTexture.onload = () => {
        console.log("Void texture loaded");
        let drawVoid = () => {
            for (let i = 0; i < map.length; i++){
                for(let j = 0; j < map[i].length; j++){
                    if(map[i][j] == "v" || map[i][j] == "S"){

                        // if(map[i][j] == "S"){
                        //     spawnX = j * (mapWidth / map[i].length) + offsetX;
                        //     spawnY = i * (mapHeight / map.length) + offsetY;
                        //     console.log(spawnX, spawnY);
                        // }
                        
                        const cellHeight = mapHeight / map.length;
                        const cellWidth = mapWidth / map[i].length;
                        objC2D.drawImage(voidTexture, j * cellWidth + offsetX, i * cellHeight + offsetY);
                    }
                }
            }
        }
    
        drawVoid();
    }

    const brickTexture = new Image();
    brickTexture.src = "./assets/textures/brick.png";

    brickTexture.onload = () => {
        console.log("Brick texture loaded");
        let drawBrick = () => {
            for (let i = 0; i < map.length; i++){
                for(let j = 0; j < map[i].length; j++){
                    if(map[i][j] == "b"){
                        const cellHeight = mapHeight / map.length;
                        const cellWidth = mapWidth / map[i].length;
                        objC2D.drawImage(brickTexture, j * cellWidth + offsetX, i * cellHeight + offsetY);
                    }
                }
            }
        }
    
        drawBrick();
    }

    const ladderTexture = new Image();
    ladderTexture.src = "./assets/textures/ladder.png";

    ladderTexture.onload = () => {
        console.log("Ladder texture loaded");
        let drawLadder = () => {
            for (let i = 0; i < map.length; i++){
                for(let j = 0; j < map[i].length; j++){
                    if(map[i][j] == "l"){
                        const cellHeight = mapHeight / map.length;
                        const cellWidth = mapWidth / map[i].length;
                        objC2D.drawImage(ladderTexture, j * cellWidth + offsetX, i * cellHeight + offsetY);
                    }
                }
            }
        }
        
        drawLadder();
    }

    const ropeTexture = new Image();
    ropeTexture.src = "./assets/textures/rope.png";

    ropeTexture.onload = () => {
        console.log("Rope texture loaded");
        let drawRope = () => {
            for (let i = 0; i < map.length; i++){
                for(let j = 0; j < map[i].length; j++){
                    if(map[i][j] == "r"){
                        const cellHeight = mapHeight / map.length;
                        const cellWidth = mapWidth / map[i].length;
                        objC2D.drawImage(ropeTexture, j * cellWidth + offsetX, i * cellHeight + offsetY);
                    }
                }
            }
        }
    
        drawRope();
    }

    const pavementTexture = new Image();
    pavementTexture.src = "./assets/textures/pavement.png";

    pavementTexture.onload = () => {
        console.log("Pavement texture loaded");
        let drawPavement = () => {
            for (let i = 0; i < map.length; i++){
                for(let j = 0; j < map[i].length; j++){
                    if(map[i][j] == "p"){
                        const cellHeight = mapHeight / map.length;
                        const cellWidth = mapWidth / map[i].length;
                        objC2D.drawImage(pavementTexture, j * cellWidth + offsetX, i * cellHeight + offsetY);
                    }
                }
            }
        }
    
        drawPavement();
    }

    const goldTexture = new Image();
    goldTexture.src = "./assets/textures/gold.png";

    goldTexture.onload = () => {
        console.log("Gold texture loaded");
        let drawGold = () => {
            for (let i = 0; i < map.length; i++){
                for(let j = 0; j < map[i].length; j++){
                    if(map[i][j] == "g"){
                        const cellHeight = mapHeight / map.length;
                        const cellWidth = mapWidth / map[i].length;
                        objC2D.drawImage(goldTexture, j * cellWidth + offsetX, i * cellHeight + offsetY);
                    }
                }
            }
        }
        drawGold();
    }  
    console.log("Map initialized");
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