// Game state variables
const gameState = {
    power: 100,
    powerRate: 1, // Base power drain rate
    currentHour: 0, // 0 = 12 AM, 5 = 5 AM
    leftDoorClosed: false,
    rightDoorClosed: false,
    leftLightOn: false,
    rightLightOn: false,
    cameraActive: false,
    phoneActive: false,
    currentCamera: "cam1",
    gamblingUrge: 0,
    money: 100, // Starting money
    gameOver: false,
    animatronic1Position: "cam1", // Cat 1 starts in Cam 1
    animatronic2Position: "cam3", // Cat 2 starts in Cam 3
    scratchTicketActive: false,
    horseRaceActive: false,
    slotsActive: false,
    selectedHorse: null,
};

// Set cat image URLs (use the same image for each animatronic)
const catImages = {
    cat1: 'images/cat1.png', // Replace with your single cat1 PNG
    cat2: 'images/cat2.png'  // Replace with your single cat2 PNG
};

// DOM Elements
const officeDoorLeft = document.getElementById("left-door-btn");
const officeDoorRight = document.getElementById("right-door-btn");
const officeLightLeft = document.getElementById("left-light-btn");
const officeLightRight = document.getElementById("right-light-btn");
const cameraBtn = document.getElementById("camera-btn");
const phoneBtn = document.getElementById("phone-btn");
const cameraView = document.getElementById("camera-view");
const officeView = document.getElementById("office-view");
const phoneView = document.getElementById("phone-view");
const powerDisplay = document.getElementById("power-display");
const powerUsage = document.getElementById("power-usage");
const timeDisplay = document.getElementById("time-display");
const gamblingDisplay = document.getElementById("gambling-meter");
const camBtns = document.querySelectorAll(".cam-btn");
const exitCamBtn = document.getElementById("exit-cam");
const cameras = document.querySelectorAll(".camera");
const camLabels = document.querySelectorAll(".cam-label");
const camTime = document.querySelector(".cam-time");
const gamblingOptions = document.querySelectorAll(".gambling-option");
const scratchTicket = document.getElementById("scratch-ticket");
const horseRace = document.getElementById("horse-race");
const slotsGame = document.getElementById("slots-game");
const scratchAreas = document.querySelectorAll(".scratch-area");
const horses = document.querySelectorAll(".horse");
const slotReels = document.querySelectorAll(".slot-reel");
const spinButton = document.getElementById("spin-button");
const slotsMessage = document.getElementById("slots-message");
const balanceDisplay = document.getElementById("balance-display");
const customCursor = document.getElementById("custom-cursor");
const gameOverScreen = document.getElementById("game-over");
const gameOverTitle = document.getElementById("game-over-title");
const gameOverReason = document.getElementById("game-over-reason");
const restartBtn = document.getElementById("restart-btn");
const jumpscareElement = document.getElementById("jumpscare");
const leftDoor = document.getElementById("left-door");
const rightDoor = document.getElementById("right-door");

// Cat elements
const cat1Elements = {
    cam1: document.getElementById("cat1-cam1"),
    cam2: document.getElementById("cat1-cam2"),
    cam3: document.getElementById("cat1-cam3"),
    door: document.getElementById("cat1-door-left")
};

const cat2Elements = {
    cam2: document.getElementById("cat2-cam2"),
    cam3: document.getElementById("cat2-cam3"),
    cam4: document.getElementById("cat2-cam4"),
    door: document.getElementById("cat2-door-right")
};

// Sound effects (replace these with your own sound files)
const doorSound = new Audio('sounds/door.mp3');
const lightSound = new Audio('sounds/light.mp3');
const cameraSound = new Audio('sounds/camera.mp3');
const staticSound = new Audio('sounds/static.mp3');
const phoneSound = new Audio('sounds/phone.mp3');
const winSound = new Audio('sounds/win.mp3');
const loseSound = new Audio('sounds/lose.mp3');
const ambientSound = new Audio('sounds/ambient.mp3');
const jumpscareSound = new Audio('sounds/jumpscare.mp3');

// Set cat images
function setCatImages() {
    // Set Cat 1 images (all use the same PNG)
    for (const key in cat1Elements) {
        if (cat1Elements[key]) {
            cat1Elements[key].style.backgroundImage = `url('${catImages.cat1}')`;
        }
    }
    
    // Set Cat 2 images (all use the same PNG)
    for (const key in cat2Elements) {
        if (cat2Elements[key]) {
            cat2Elements[key].style.backgroundImage = `url('${catImages.cat2}')`;
        }
    }
}

// Custom cursor movement
document.addEventListener("mousemove", (e) => {
    customCursor.style.left = e.clientX + "px";
    customCursor.style.top = e.clientY + "px";
});

// Game initialization
function initGame() {
    // Reset game state
    Object.assign(gameState, {
        power: 100,
        powerRate: 1,
        currentHour: 0,
        leftDoorClosed: false,
        rightDoorClosed: false,
        leftLightOn: false,
        rightLightOn: false,
        cameraActive: false,
        phoneActive: false,
        currentCamera: "cam1",
        gamblingUrge: 0,
        money: 100,
        gameOver: false,
        animatronic1Position: "cam1",
        animatronic2Position: "cam3",
        scratchTicketActive: false,
        horseRaceActive: false,
        slotsActive: false,
        selectedHorse: null,
    });

    // Update UI
    updatePowerDisplay();
    updateTimeDisplay();
    updateGamblingDisplay();
    updateBalanceDisplay();
    
    // Reset door positions
    leftDoor.style.opacity = "0";
    rightDoor.style.opacity = "0";
    
    // Reset button states
    officeDoorLeft.classList.remove("active");
    officeDoorRight.classList.remove("active");
    officeLightLeft.classList.remove("active");
    officeLightRight.classList.remove("active");
    
    // Hide all cat elements
    hideAllCats();
    
    // Set cat images
    setCatImages();
    
    // Start background ambient sound
    ambientSound.loop = true;
    ambientSound.volume = 0.3;
    try {
        ambientSound.play().catch(e => console.log("Audio play failed:", e));
    } catch (e) {
        console.log("Audio play error:", e);
    }
    
    // Start game loops
    startGameLoops();
}

// Handle door buttons
officeDoorLeft.addEventListener("click", () => {
    if (gameState.gameOver || gameState.phoneActive) return;
    
    gameState.leftDoorClosed = !gameState.leftDoorClosed;
    officeDoorLeft.classList.toggle("active", gameState.leftDoorClosed);
    
    // Show/hide the door
    leftDoor.style.opacity = gameState.leftDoorClosed ? "1" : "0";
    
    // Play door sound
    try {
        doorSound.currentTime = 0;
        doorSound.play().catch(e => console.log("Audio play failed:", e));
    } catch (e) {
        console.log("Audio play error:", e);
    }
    
    // Update power drain rate
    updatePowerRate();
});

officeDoorRight.addEventListener("click", () => {
    if (gameState.gameOver || gameState.phoneActive) return;
    
    gameState.rightDoorClosed = !gameState.rightDoorClosed;
    officeDoorRight.classList.toggle("active", gameState.rightDoorClosed);
    
    // Show/hide the door
    rightDoor.style.opacity = gameState.rightDoorClosed ? "1" : "0";
    
    // Play door sound
    try {
        doorSound.currentTime = 0;
        doorSound.play().catch(e => console.log("Audio play failed:", e));
    } catch (e) {
        console.log("Audio play error:", e);
    }
    
    // Update power drain rate
    updatePowerRate();
});

// Handle light buttons
officeLightLeft.addEventListener("click", () => {
    if (gameState.gameOver || gameState.phoneActive) return;
    
    gameState.leftLightOn = !gameState.leftLightOn;
    officeLightLeft.classList.toggle("active", gameState.leftLightOn);
    
    // Play light sound
    try {
        lightSound.currentTime = 0;
        lightSound.play().catch(e => console.log("Audio play failed:", e));
    } catch (e) {
        console.log("Audio play error:", e);
    }
    
    // Update power drain rate
    updatePowerRate();
    
    // Check if animatronic is at the door
    checkForAnimatronics();
});

officeLightRight.addEventListener("click", () => {
    if (gameState.gameOver || gameState.phoneActive) return;
    
    gameState.rightLightOn = !gameState.rightLightOn;
    officeLightRight.classList.toggle("active", gameState.rightLightOn);
    
    // Play light sound
    try {
        lightSound.currentTime = 0;
        lightSound.play().catch(e => console.log("Audio play failed:", e));
    } catch (e) {
        console.log("Audio play error:", e);
    }
    
    // Update power drain rate
    updatePowerRate();
    
    // Check if animatronic is at the door
    checkForAnimatronics();
});

// Handle camera button
cameraBtn.addEventListener("click", () => {
    if (gameState.gameOver || gameState.phoneActive) return;
    
    toggleCamera();
});

// Handle camera view buttons
camBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        if (btn.id === "exit-cam") {
            toggleCamera();
            return;
        }
        
        const camId = btn.dataset.cam;
        switchCamera(camId);
    });
});

// Handle phone button
phoneBtn.addEventListener("click", () => {
    if (gameState.gameOver) return;
    
    togglePhone();
});

// Handle gambling options
gamblingOptions.forEach(option => {
    option.addEventListener("click", () => {
        const gamblingType = option.dataset.option;
        
        if (gamblingType === "scratch" && gameState.money >= 5) {
            gameState.money -= 5;
            updateBalanceDisplay();
            startScratchTicket();
        } else if (gamblingType === "horserace" && gameState.money >= 10) {
            gameState.money -= 10;
            updateBalanceDisplay();
            startHorseRace();
        } else if (gamblingType === "slots" && gameState.money >= 8) {
            gameState.money -= 8;
            updateBalanceDisplay();
            startSlots();
        }
    });
});

// Handle scratch ticket areas
scratchAreas.forEach(area => {
    area.addEventListener("mouseover", (e) => {
        if (gameState.scratchTicketActive && e.buttons === 1) {
            scratchArea(area);
        }
    });
    
    area.addEventListener("mousedown", () => {
        if (gameState.scratchTicketActive) {
            scratchArea(area);
        }
    });
});

// Handle horse selection
horses.forEach((horse, index) => {
    horse.addEventListener("click", () => {
        if (gameState.horseRaceActive && !gameState.selectedHorse) {
            gameState.selectedHorse = index;
            horse.classList.add("selected");
            startRace();
        }
    });
});

// Handle spin button for slots
spinButton.addEventListener("click", () => {
    if (gameState.slotsActive && !spinButton.disabled) {
        spinSlots();
    }
});

// Handle restart button
restartBtn.addEventListener("click", () => {
    gameOverScreen.style.display = "none";
    initGame();
});

// Game mechanic functions
function toggleCamera() {
    gameState.cameraActive = !gameState.cameraActive;
    
    if (gameState.cameraActive) {
        cameraView.style.display = "block";
        officeView.style.display = "none";
        switchCamera(gameState.currentCamera);
        
        try {
            cameraSound.currentTime = 0;
            cameraSound.play().catch(e => console.log("Audio play failed:", e));
            
            staticSound.loop = true;
            staticSound.volume = 0.1;
            staticSound.play().catch(e => console.log("Audio play failed:", e));
        } catch (e) {
            console.log("Audio play error:", e);
        }
    } else {
        cameraView.style.display = "none";
        officeView.style.display = "block";
        
        try {
            cameraSound.currentTime = 0;
            cameraSound.play().catch(e => console.log("Audio play failed:", e));
            staticSound.pause();
        } catch (e) {
            console.log("Audio play error:", e);
        }
    }
    
    // Update power drain rate
    updatePowerRate();
}

function switchCamera(camId) {
    gameState.currentCamera = camId;
    
    // Hide all cameras and labels
    cameras.forEach(cam => {
        cam.style.display = "none";
    });
    
    camLabels.forEach(label => {
        label.style.display = "none";
    });
    
    // Show selected camera and label
    document.getElementById(camId).style.display = "block";
    document.getElementById(`${camId}-label`).style.display = "block";
    
    // Update camera content - show/hide cats based on their positions
    updateCameraContent();
    
    // Play static sound effect
    try {
        staticSound.volume = 0.2;
        setTimeout(() => {
            staticSound.volume = 0.1;
        }, 300);
    } catch (e) {
        console.log("Audio volume error:", e);
    }
}

function togglePhone() {
    gameState.phoneActive = !gameState.phoneActive;
    
    if (gameState.phoneActive) {
        phoneView.style.display = "flex";
        
        // Show main gambling menu, hide games
        document.getElementById("gambling-menu").style.display = "block";
        scratchTicket.style.display = "none";
        horseRace.style.display = "none";
        slotsGame.style.display = "none";
        
        // Update money display
        updateBalanceDisplay();
        
        try {
            phoneSound.currentTime = 0;
            phoneSound.play().catch(e => console.log("Audio play failed:", e));
        } catch (e) {
            console.log("Audio play error:", e);
        }
    } else {
        phoneView.style.display = "none";
        
        try {
            phoneSound.currentTime = 0;
            phoneSound.play().catch(e => console.log("Audio play failed:", e));
        } catch (e) {
            console.log("Audio play error:", e);
        }
    }
}

function updateBalanceDisplay() {
    balanceDisplay.textContent = `BALANCE: $${gameState.money}`;
}

function startScratchTicket() {
    document.getElementById("gambling-menu").style.display = "none";
    scratchTicket.style.display = "block";
    horseRace.style.display = "none";
    slotsGame.style.display = "none";
    
    gameState.scratchTicketActive = true;
    
    // Reset scratch areas
    scratchAreas.forEach(area => {
        area.classList.remove("scratched");
        area.classList.remove("win");
        area.classList.remove("lose");
        area.textContent = "";
        
        // Assign random prize values (more zeros than winners)
        const randomValue = Math.random();
        if (randomValue > 0.7) {
            // Winner - assign value between $5 and $25
            area.dataset.prize = Math.floor(Math.random() * 5) * 5 + 5;
        } else {
            // Loser - zero value
            area.dataset.prize = 0;
        }
    });
}

function scratchArea(area) {
    if (area.classList.contains("scratched")) return;
    
    area.classList.add("scratched");
    
    const prize = parseInt(area.dataset.prize);
    if (prize > 0) {
        area.textContent = "$" + prize;
        area.classList.add("win");
        gameState.money += prize;
        
        // Update money display
        updateBalanceDisplay();
        
        try {
            winSound.currentTime = 0;
            winSound.play().catch(e => console.log("Audio play failed:", e));
        } catch (e) {
            console.log("Audio play error:", e);
        }
    } else {
        area.textContent = "$0";
        area.classList.add("lose");
    }
    
    // Check if all areas are scratched
    const allScratched = Array.from(scratchAreas).every(a => a.classList.contains("scratched"));
    if (allScratched) {
        setTimeout(() => {
            finishGambling();
        }, 1000);
    }
}

function startHorseRace() {
    document.getElementById("gambling-menu").style.display = "none";
    scratchTicket.style.display = "none";
    horseRace.style.display = "block";
    slotsGame.style.display = "none";
    
    gameState.horseRaceActive = true;
    gameState.selectedHorse = null;
    
    // Reset horses
    horses.forEach(horse => {
        horse.style.left = "70px";
        horse.classList.remove("selected");
        horse.classList.remove("winner");
    });
}

function startRace() {
    let raceFinished = false;
    const raceInterval = setInterval(() => {
        if (raceFinished) return;
        
        let winnerFound = false;
        
        horses.forEach((horse, index) => {
            const currentLeft = parseInt(horse.style.left) || 70;
            const movement = Math.floor(Math.random() * 5) + 1;
            const newLeft = currentLeft + movement;
            
            horse.style.left = newLeft + "px";
            
            // Check for winner (finish line is at 230px)
            if (newLeft >= 230 && !winnerFound) {
                winnerFound = true;
                raceFinished = true;
                clearInterval(raceInterval);
                
                // Mark winner
                horse.classList.add("winner");
                
                if (index === gameState.selectedHorse) {
                    gameState.money += 25; // $25 win for correct horse
                    
                    // Update money display
                    updateBalanceDisplay();
                    
                    try {
                        winSound.currentTime = 0;
                        winSound.play().catch(e => console.log("Audio play failed:", e));
                    } catch (e) {
                        console.log("Audio play error:", e);
                    }
                } else {
                    try {
                        loseSound.currentTime = 0;
                        loseSound.play().catch(e => console.log("Audio play failed:", e));
                    } catch (e) {
                        console.log("Audio play error:", e);
                    }
                }
                
                setTimeout(() => {
                    finishGambling();
                }, 1500);
            }
        });
    }, 100);
}

function startSlots() {
    document.getElementById("gambling-menu").style.display = "none";
    scratchTicket.style.display = "none";
    horseRace.style.display = "none";
    slotsGame.style.display = "block";
    
    gameState.slotsActive = true;
    
    // Reset slots display
    slotReels.forEach(reel => {
        reel.textContent = "?";
    });
    
    // Reset message
    slotsMessage.textContent = "";
    
    // Enable spin button
    spinButton.disabled = false;
}

function spinSlots() {
    // Disable button during spin
    spinButton.disabled = true;
    
    // Slot symbols
    const symbols = ["7", "$", "♥", "♦", "♠", "♣"];
    
    // Function to spin a single reel
    function spinReel(reel, delay, callback) {
        let spinCount = 0;
        const maxSpins = 10 + Math.floor(Math.random() * 5);
        
        const spinInterval = setInterval(() => {
            // Pick random symbol
            const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
            reel.textContent = randomSymbol;
            
            spinCount++;
            if (spinCount >= maxSpins) {
                clearInterval(spinInterval);
                if (callback) callback();
            }
        }, 100);
    }
    
    // Spin all reels with staggered timing
    spinReel(slotReels[0], 0, () => {
        spinReel(slotReels[1], 100, () => {
            spinReel(slotReels[2], 200, () => {
                // Check for wins after all reels have stopped
                checkSlotsWin();
            });
        });
    });
}

function checkSlotsWin() {
    const results = Array.from(slotReels).map(reel => reel.textContent);
    
    let winAmount = 0;
    
    // Check for three of a kind
    if (results[0] === results[1] && results[1] === results[2]) {
        if (results[0] === "7") {
            winAmount = 50; // Jackpot for three 7s
        } else if (results[0] === "$") {
            winAmount = 30; // Big win for three $ symbols
        } else {
            winAmount = 15; // Standard win for other three of a kind
        }
    }
    // Check for two of a kind with 7
    else if ((results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) &&
             (results.includes("7"))) {
        winAmount = 10; // Medium win for a pair with 7
    }
    // Check for any other pair
    else if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
        winAmount = 5; // Small win for any other pair
    }
    
    // Update win display and play sound
    if (winAmount > 0) {
        gameState.money += winAmount;
        slotsMessage.textContent = `YOU WON $${winAmount}!`;
        updateBalanceDisplay();
        
        try {
            winSound.currentTime = 0;
            winSound.play().catch(e => console.log("Audio play failed:", e));
        } catch (e) {
            console.log("Audio play error:", e);
        }
    } else {
        slotsMessage.textContent = "TRY AGAIN!";
        
        try {
            loseSound.currentTime = 0;
            loseSound.play().catch(e => console.log("Audio play failed:", e));
        } catch (e) {
            console.log("Audio play error:", e);
        }
    }
    
    // Reset slots after a delay
    setTimeout(() => {
        finishGambling();
    }, 2000);
}

function finishGambling() {
    gameState.scratchTicketActive = false;
    gameState.horseRaceActive = false;
    gameState.slotsActive = false;
    
    // Return to main menu
    document.getElementById("gambling-menu").style.display = "block";
    scratchTicket.style.display = "none";
    horseRace.style.display = "none";
    slotsGame.style.display = "none";
    
    // Reset gambling urge
    gameState.gamblingUrge = 0;
    updateGamblingDisplay();
    
    // Allow closing the phone
    setTimeout(() => {
        if (gameState.phoneActive) {
            togglePhone();
        }
    }, 500);
}

function updatePowerRate() {
    // Base rate is 1
    let rate = 1;
    
    // Add 1 for each active system
    if (gameState.leftDoorClosed) rate += 1;
    if (gameState.rightDoorClosed) rate += 1;
    if (gameState.leftLightOn) rate += 1;
    if (gameState.rightLightOn) rate += 1;
    if (gameState.cameraActive) rate += 1;
    
    gameState.powerRate = rate;
    
    // Update power usage indicator
    let usageDisplay = "";
    for (let i = 0; i < rate; i++) {
        usageDisplay += "■";
    }
    powerUsage.textContent = usageDisplay;
}

function updatePowerDisplay() {
    powerDisplay.textContent = `Power: ${Math.floor(gameState.power)}%`;
    
    // Update color based on power level
    if (gameState.power <= 20) {
        powerDisplay.style.color = "#ff0000";
    } else if (gameState.power <= 50) {
        powerDisplay.style.color = "#ffff00";
    } else {
        powerDisplay.style.color = "#00ff00";
    }
}

function updateTimeDisplay() {
    // Map currentHour (0-5) to 12 AM - 5 AM
    let displayHour;
    if (gameState.currentHour === 0) {
        displayHour = 12; // 12 AM
    } else {
        displayHour = gameState.currentHour; // 1 AM, 2 AM, etc.
    }
    
    // All hours from 12 AM to 5 AM are AM
    timeDisplay.textContent = `${displayHour} AM`;
    camTime.textContent = `${displayHour} AM`; // Update camera time too
    
    // Note: 6 AM is handled by winGame, so it won't display here
}

function updateGamblingDisplay() {
    gamblingDisplay.textContent = `Gambling Urge: ${Math.floor(gameState.gamblingUrge)}%`;
    
    // Change color based on urgency
    if (gameState.gamblingUrge > 80) {
        gamblingDisplay.style.color = "#ff0000";
    } else if (gameState.gamblingUrge > 50) {
        gamblingDisplay.style.color = "#ffff00";
    } else {
        gamblingDisplay.style.color = "#00ff00";
    }
}

function hideAllCats() {
    // Hide all cat elements
    for (const key in cat1Elements) {
        if (cat1Elements[key]) {
            cat1Elements[key].style.display = "none";
        }
    }
    
    for (const key in cat2Elements) {
        if (cat2Elements[key]) {
            cat2Elements[key].style.display = "none";
        }
    }
}

function updateCameraContent() {
    // First hide all cats
    hideAllCats();
    
    // Then show the appropriate ones based on their positions
    if (gameState.animatronic1Position.startsWith("cam")) {
        const camNumber = gameState.animatronic1Position; // "cam1", "cam2", etc.
        if (cat1Elements[camNumber]) {
            cat1Elements[camNumber].style.display = "block";
        }
    }
    
    if (gameState.animatronic2Position.startsWith("cam")) {
        const camNumber = gameState.animatronic2Position; // "cam2", "cam3", etc.
        if (cat2Elements[camNumber]) {
            cat2Elements[camNumber].style.display = "block";
        }
    }
}

function checkForAnimatronics() {
    // Check left door for Cat 1
    if (gameState.animatronic1Position === "leftDoor" && gameState.leftLightOn) {
        // Show Cat 1 at left door
        cat1Elements.door.style.display = "block";
    } else {
        cat1Elements.door.style.display = "none";
    }
    
    // Check right door for Cat 2
    if (gameState.animatronic2Position === "rightDoor" && gameState.rightLightOn) {
        // Show Cat 2 at right door
        cat2Elements.door.style.display = "block";
    } else {
        cat2Elements.door.style.display = "none";
    }
}

function moveAnimatronics() {
    // Only move animatronics if the player isn't looking at their camera
    if (!gameState.cameraActive || gameState.currentCamera !== gameState.animatronic1Position) {
        // Move Cat 1
        moveAnimatronic1();
    }
    
    if (!gameState.cameraActive || gameState.currentCamera !== gameState.animatronic2Position) {
        // Move Cat 2
        moveAnimatronic2();
    }
    
    // Check for jumpscares
    checkForJumpscares();
}

function moveAnimatronic1() {
    const currentPos = gameState.animatronic1Position;
    const moveChance = Math.random();
    
    // Cat 1 movement pattern (gets more aggressive as night progresses)
    const hourMultiplier = 1 + (gameState.currentHour * 0.15); // Increases chance of movement
    
    if (currentPos === "cam1" && moveChance > 0.8 / hourMultiplier) {
        gameState.animatronic1Position = "cam2";
    } else if (currentPos === "cam2" && moveChance > 0.7 / hourMultiplier) {
        gameState.animatronic1Position = "cam3";
    } else if (currentPos === "cam3" && moveChance > 0.7 / hourMultiplier) {
        gameState.animatronic1Position = "leftDoor";
    } else if (currentPos === "leftDoor" && moveChance > 0.8) {
        // Move back to starting position occasionally (less likely as night progresses)
        gameState.animatronic1Position = "cam1";
    }
}

function moveAnimatronic2() {
    const currentPos = gameState.animatronic2Position;
    const moveChance = Math.random();
    
    // Cat 2 movement pattern (gets more aggressive as night progresses)
    const hourMultiplier = 1 + (gameState.currentHour * 0.15); // Increases chance of movement
    
    if (currentPos === "cam3" && moveChance > 0.8 / hourMultiplier) {
        gameState.animatronic2Position = "cam4";
    } else if (currentPos === "cam4" && moveChance > 0.7 / hourMultiplier) {
        gameState.animatronic2Position = "cam2";
    } else if (currentPos === "cam2" && moveChance > 0.7 / hourMultiplier) {
        gameState.animatronic2Position = "rightDoor";
    } else if (currentPos === "rightDoor" && moveChance > 0.8) {
        // Move back to starting position occasionally (less likely as night progresses)
        gameState.animatronic2Position = "cam3";
    }
}

function checkForJumpscares() {
    // Check for left door jumpscare
    if (gameState.animatronic1Position === "leftDoor" && !gameState.leftDoorClosed) {
        const jumpscareChance = 0.15 * (1 + gameState.currentHour * 0.1);
        if (Math.random() < jumpscareChance) {
            triggerJumpscare("cat1");
        }
    }

    // Check for right door jumpscare
    if (gameState.animatronic2Position === "rightDoor" && !gameState.rightDoorClosed) {
        const jumpscareChance = 0.15 * (1 + gameState.currentHour * 0.1);
        if (Math.random() < jumpscareChance) {
            triggerJumpscare("cat2");
        }
    }

    // Check for gambling urge jumpscare - use a cat instead
    if (gameState.gamblingUrge >= 100) {
        const catType = Math.random() < 0.5 ? "cat1" : "cat2";
        triggerJumpscare(catType);
    }
}

function triggerJumpscare(type) {
    // Stop game loops
    stopGameLoops();

    // Set game over state
    gameState.gameOver = true;

    // Stop ambient sound and play jumpscare sound
    try {
        ambientSound.pause();
        jumpscareSound.volume = 0.7;
        jumpscareSound.play().catch(e => console.error("Jumpscare sound failed:", e));
    } catch (e) {
        console.error("Audio play error:", e);
    }

    // Ensure game over screen is hidden initially
    gameOverScreen.style.display = "none";

    // Use cat1.png or cat2.png from catImages
    jumpscareElement.style.backgroundImage = `url('${catImages[type]}')`;
    jumpscareElement.style.display = "block";
    jumpscareElement.style.zIndex = "101"; // Ensure it’s on top

    // Set game over reason
    let reason = "";
    if (type === "cat1") reason = "Cat 1 got you!";
    else if (type === "cat2") reason = "Cat 2 got you!";
    else if (type === "gambling") reason = "Your gambling addiction got the best of you!";
    else if (type === "power") reason = "You ran out of power!";
    gameOverReason.textContent = reason;

    // Show game over screen after 3 seconds
    setTimeout(() => {
        jumpscareElement.style.display = "none";
        gameOverScreen.style.display = "flex";
    }, 3000);
}

// Game loops
let powerDrainInterval;
let timeUpdateInterval;
let animatronicMoveInterval;
let gamblingUrgeInterval;

function startGameLoops() {
    console.log("Starting game loops");
    
    // Power drain loop - every second
    powerDrainInterval = setInterval(() => {
        console.log("Power: " + gameState.power);
        if (gameState.power <= 0) {
            powerOutage();
            return;
        }
        
        gameState.power -= 0.25 * gameState.powerRate; // 1% per second per system
        updatePowerDisplay();
    }, 1000);
    
    // Time update loop - every 45 seconds represents an hour
    timeUpdateInterval = setInterval(() => {
        gameState.currentHour++;
        updateTimeDisplay();
        
        // Check for win condition (6 AM)
        if (gameState.currentHour >= 6) {
            winGame();
        }
    }, 45000); // 10 seconds for testing (adjust to 45000 for normal gameplay)
    
    // Animatronic movement loop - random intervals
    animatronicMoveInterval = setInterval(() => {
        moveAnimatronics();
    }, 5000 + Math.random() * 5000); // 5-10 second intervals
    
    // Gambling urge increase loop - every 3 seconds
    gamblingUrgeInterval = setInterval(() => {
        gameState.gamblingUrge += 1 + Math.random() * 18;
        if (gameState.gamblingUrge > 100) gameState.gamblingUrge = 100; // Cap at 100%
        updateGamblingDisplay();
    }, 3000);
}

function stopGameLoops() {
    clearInterval(powerDrainInterval);
    clearInterval(timeUpdateInterval);
    clearInterval(animatronicMoveInterval);
    clearInterval(gamblingUrgeInterval);
}

function powerOutage() {
    // Turn off all systems
    gameState.leftDoorClosed = false;
    gameState.rightDoorClosed = false;
    gameState.leftLightOn = false;
    gameState.rightLightOn = false;
    gameState.cameraActive = false;

    // Update UI
    officeDoorLeft.classList.remove("active");
    officeDoorRight.classList.remove("active");
    officeLightLeft.classList.remove("active");
    officeLightRight.classList.remove("active");

    // Hide doors
    leftDoor.style.opacity = "0";
    rightDoor.style.opacity = "0";

    // Close camera view if open
    if (cameraView.style.display === "block") {
        cameraView.style.display = "none";
        officeView.style.display = "block";
    }

    // Stop ambient sound
    try {
        ambientSound.pause();
    } catch (e) {
        console.error("Audio pause error:", e);
    }

    // Trigger a cat jumpscare using cat1.png or cat2.png
    const catType = Math.random() < 0.5 ? "cat1" : "cat2";
    triggerJumpscare(catType);
}

function winGame() {
    // Stop game loops
    stopGameLoops();
    
    // Stop ambient sound
    try {
        ambientSound.pause();
        winSound.play().catch(e => console.log("Audio play failed:", e));
    } catch (e) {
        console.log("Audio play error:", e);
    }
    
    // Show win screen
    gameOverTitle.textContent = "YOU WIN!";
    gameOverReason.textContent = "Congratulations! You survived until 6 AM!";
    gameOverScreen.style.display = "flex";
}

// Initialize the game when the page loads
window.addEventListener("load", () => {
    console.log("Window loaded, initializing game");
    initGame();
});

// Move the cursor with the mouse
document.addEventListener("mousemove", (e) => {
    const customCursor = document.getElementById("custom-cursor");
    customCursor.style.left = e.clientX + "px";
    customCursor.style.top = e.clientY + "px";
    customCursor.style.display = "block"; // Ensure it’s visible
});