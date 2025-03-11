class Guard {
    constructor(x, y, img) {
        this.imgGuard = img;
        this.guardintX = x;
        this.guardintY = y;
        this.width = 64;
        this.height = 64;
        this.guardSpeed = 1.2;
        // guardDirection: 1 for right, -1 for left. Initially random.
        this.guardDirection = Math.random() < 0.5 ? -1 : 1;
        this.guardState = "freeze";
        this.fallingTimer = 0;
    }
}

// Global list of guards
let lstGuards;

function initGuard() {
    objImgGuard = new Image();
    objImgGuard.src = "assets/guards/guardIDLE.png";

    lstGuards = [];

    // Find spawn points for guards (exclude the player's level)
    let playerLevel = Math.floor((objPlayer.playerIntY - OFFSET_Y) / 64);
    let guardSpawnPoints = [];

    for (let i = 0; i < map.length; i++) {
        if (i === playerLevel) continue;
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] === "v" && map[i + 1][j] === "b") {
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

function drawGuard() {
    objC2D.save();
    lstGuards.forEach(guard => {
        drawGuardHitBox(guard);
        objC2D.drawImage(guard.imgGuard, guard.guardintX, guard.guardintY);
    });
    objC2D.restore();
}

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

function resolveGuardHorizontalCollisions(guard) {
    let guardBox = getGuardBox(guard);
    const tileWidth = mapWidth / map[0].length;
    const tileHeight = mapHeight / map.length;

    let startCol = Math.floor((guardBox.left - OFFSET_X) / tileWidth);
    let endCol = Math.floor((guardBox.right - OFFSET_X) / tileWidth);
    let startRow = Math.floor((guardBox.top - OFFSET_Y) / tileHeight);
    let endRow = Math.floor((guardBox.bottom - OFFSET_Y) / tileHeight);

    startCol = Math.max(0, startCol);
    endCol = Math.min(map[0].length - 1, endCol);
    startRow = Math.max(0, startRow);
    endRow = Math.min(map.length - 1, endRow);

    for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
            // Skip ladder tiles when resolving horizontal collisions
            if (map[row][col] === "l") continue;
            if (estTuileSolide(map[row][col])) {
                let tileBox = getTileBox(row, col);
                if (rectIntersect(guardBox, tileBox)) {
                    let penetrationLeft = guardBox.right - tileBox.left;
                    let penetrationRight = tileBox.right - guardBox.left;
                    if (penetrationLeft < penetrationRight) {
                        guard.guardintX -= penetrationLeft;
                    } else {
                        guard.guardintX += penetrationRight;
                    }
                    guardBox = getGuardBox(guard);
                }
            }
        }
    }
}

function resolveGuardVerticalCollisions(guard) {
    let guardBox = getGuardBox(guard);
    const tileWidth = mapWidth / map[0].length;
    const tileHeight = mapHeight / map.length;

    let startCol = Math.floor((guardBox.left - OFFSET_X) / tileWidth);
    let endCol = Math.floor((guardBox.right - OFFSET_X) / tileWidth);
    let startRow = Math.floor((guardBox.top - OFFSET_Y) / tileHeight);
    let endRow = Math.floor((guardBox.bottom - OFFSET_Y) / tileHeight);

    startCol = Math.max(0, startCol);
    endCol = Math.min(map[0].length - 1, endCol);
    startRow = Math.max(0, startRow);
    endRow = Math.min(map.length - 1, endRow);

    for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
            // Skip ladder tiles so vertical movement isn’t canceled
            if (map[row][col] === "l") continue;
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
}

// For ladder mode, we check the tile under the guard's bottom-center.
function getGuardLadderData(guard) {
    const tileWidth = mapWidth / map[0].length;
    const tileHeight = mapHeight / map.length;
    let bottomCenterX = guard.guardintX + guard.width / 2;
    let bottomCenterY = guard.guardintY + guard.height - 1;
    let gridX = Math.floor((bottomCenterX - OFFSET_X) / tileWidth);
    let gridY = Math.floor((bottomCenterY - OFFSET_Y) / tileHeight);
    if (map[gridY] && map[gridY][gridX] === "l") {
        let ladderCentre = OFFSET_X + gridX * tileWidth + tileWidth / 2;
        return { onLadder: true, ladderCentre, row: gridY, col: gridX };
    }
    return { onLadder: false };
}

// Checks if moving the guard to (newX, newY) would cause a collision with another guard.
function wouldCollide(guard, newX, newY) {
    let newBox = {
        left: newX,
        right: newX + guard.width,
        top: newY,
        bottom: newY + guard.height
    };
    for (let other of lstGuards) {
        if (other === guard) continue;
        if (rectIntersect(newBox, getGuardBox(other))) {
            return true;
        }
    }
    return false;
}

function updateGuards() {
    lstGuards.forEach(guard => {
        if (guard.guardState !== "freeze") {
            // Use ladder data based on the guard's bottom-center.
            let ladderData = getGuardLadderData(guard);
            if (ladderData.onLadder) {
                // --- CLIMBING MODE ---
                // Adjust horizontally toward the ladder centre.
                let guardCentre = guard.guardintX + guard.width / 2;
                let dx = ladderData.ladderCentre - guardCentre;
                if (Math.abs(dx) > 1) {
                    let newX = guard.guardintX + Math.sign(dx) * guard.guardSpeed;
                    // Avoid colliding with another guard.
                    if (!wouldCollide(guard, newX, guard.guardintY)) {
                        guard.guardintX = newX;
                    } else {
                        // Reverse direction if blocked.
                        guard.guardDirection = -Math.sign(dx);
                    }
                }
                // Vertical movement: try to reduce vertical gap with player.
                let verticalDiff = objPlayer.playerIntY - guard.guardintY;
                if (verticalDiff < -1) {
                    let newY = guard.guardintY - guard.guardSpeed;
                    if (!wouldCollide(guard, guard.guardintX, newY))
                        guard.guardintY = newY;
                } else if (verticalDiff > 1) {
                    const tileWidth = mapWidth / map[0].length;
                    const tileHeight = mapHeight / map.length;
                    let gridX = Math.floor((guard.guardintX - OFFSET_X + guard.width / 2) / tileWidth);
                    let gridY = Math.floor((guard.guardintY - OFFSET_Y + guard.height) / tileHeight);
                    if (map[gridY] && map[gridY][gridX] !== "l" && estTuileSolide(map[gridY][gridX])) {
                        guard.guardintY = OFFSET_Y + gridY * tileHeight - guard.height;
                        guard.guardState = "grounded";
                    } else {
                        let newY = guard.guardintY + guard.guardSpeed;
                        if (!wouldCollide(guard, guard.guardintX, newY))
                            guard.guardintY = newY;
                    }
                }
                // (No collision resolution call here so the guard remains in climbing mode.)
            } else {
                // --- GROUND / FALLING MODE ---
                const tileWidth = mapWidth / map[0].length;
                const tileHeight = mapHeight / map.length;
                let gridX = Math.floor((guard.guardintX - OFFSET_X) / tileWidth);
                let gridY = Math.floor((guard.guardintY - OFFSET_Y) / tileHeight);

                let tileBelow = map[gridY + 1] ? map[gridY + 1][gridX] : null;
                let isOnSolidGround = (tileBelow === "b" || tileBelow === "p" || tileBelow === "l");

                if (!isOnSolidGround) {
                    // Simulate falling.
                    let newY = guard.guardintY + guard.guardSpeed;
                    if (!wouldCollide(guard, guard.guardintX, newY))
                        guard.guardintY = newY;
                    guard.guardState = "falling";
                    resolveGuardVerticalCollisions(guard);
                } else {
                    guard.guardState = "grounded";
                    // --- HORIZONTAL MOVEMENT TOWARD THE PLAYER ---
                    let horizontalDiff = objPlayer.playerIntX - guard.guardintX;
                    // Determine desired direction.
                    let desiredDir = horizontalDiff > 0 ? 1 : -1;
                    // Avoid standing still: if difference is very small, keep previous direction.
                    if (Math.abs(horizontalDiff) < 5) desiredDir = guard.guardDirection;
                    // Attempt a horizontal move.
                    let newX = guard.guardintX + desiredDir * guard.guardSpeed;
                    if (!wouldCollide(guard, newX, guard.guardintY)) {
                        guard.guardintX = newX;
                        guard.guardDirection = desiredDir;
                    } else {
                        // If collision is imminent with another guard, try reversing direction.
                        newX = guard.guardintX - desiredDir * guard.guardSpeed;
                        if (!wouldCollide(guard, newX, guard.guardintY)) {
                            guard.guardintX = newX;
                            guard.guardDirection = -desiredDir;
                        }
                    }
                    resolveGuardHorizontalCollisions(guard);
                }
            }
        }
    });
}

// Activate guards when the player moves horizontally.
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        lstGuards.forEach(guard => {
            guard.guardState = "grounded";
        });
    }
});
