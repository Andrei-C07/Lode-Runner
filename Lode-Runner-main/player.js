function initPlayer(){
    player = new Object();
    player = new Image();
    player.src = "assets/player/playerIDLE.png";
    player.onload = function() {
        drawPlayer();
    };
    playerX = spawnX;
    playerY = spawnY;
}

function drawPlayer(){
    objC2D.drawImage(player, playerX, playerY);
    //player = null;
}

// function movePlayer(){
//     switch (event.keyCode) {
//         case 39: // Flèche-à-droite
//             playerX += 10;
//             drawPlayer();
//             break;
//     }
// }