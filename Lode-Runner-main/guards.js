//initialisation et dessin des gardes

function initGuard(){
    objImgGuard = new Image();
    objImgGuard.src = "assets/guards/guardIDLE.png";
    objGuard = new Object();
    objGuard.imgGuard = objImgGuard;
    objGuard.guardintX = spawnX + 300;
    objGuard.guardintY = spawnY;
    objGuard.width = 64;
    objGuard.height = 64;
    objGuard.guardSpeed = 12;
    objGuard.guardDirection = 0;
    objGuard.guardState = "grounded";
    objGuard.fallingTimer = 0;
}

function drawGuard(){
    objC2D.save();
    drawGuardHitBox();
    objC2D.drawImage(objGuard.imgGuard, objGuard.guardintX, objGuard.guardintY);
    objC2D.restore();
}

// dessiner la boite de collision des gardes.
//Utile pour faire des tests.
function drawGuardHitBox() {
    objC2D.strokeStyle = "red";
    objC2D.strokeRect(objGuard.guardintX, objGuard.guardintY, objGuard.width, objGuard.height);
}

function updateGuards(){

}
