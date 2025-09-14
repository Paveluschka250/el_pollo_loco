let gameStarted = false;
let gameWorld = null;
let soundEnabled = true;

function init() {
  setupMenuEventListeners();
  setupSoundToggle();
}


function setupMenuEventListeners() {
  const startGameBtn = document.getElementById("start-game-btn");
  const howToPlayBtn = document.getElementById("how-to-play-btn");
  const impressumBtn = document.getElementById("impressum-btn");
  const backToMenuBtn = document.getElementById("back-to-menu-btn");
  const backToMenuImpressumBtn = document.getElementById("back-to-menu-impressum-btn");
  startGameBtn.addEventListener("click", startGame);
  howToPlayBtn.addEventListener("click", showHowToPlay);
  impressumBtn.addEventListener("click", showImpressum);
  backToMenuBtn.addEventListener("click", backToMainMenu);
  backToMenuImpressumBtn.addEventListener("click", backToMainMenuFromImpressum);
}

function setupSoundToggle() {
  const soundToggleBtn = document.getElementById("sound-toggle-btn");
  const soundIcon = document.getElementById("sound-icon");
  
  soundToggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleSound();
  });
  
  // Prevent keyboard events from affecting the sound toggle button
  soundToggleBtn.addEventListener("keydown", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
  
  soundToggleBtn.addEventListener("keyup", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
  
  // Initialize sound manager and load state
  const soundManager = SoundManager.getInstance();
  soundEnabled = soundManager.soundEnabled;
  updateSoundIcon();
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  updateSoundIcon();
  
  // Apply sound state to sound manager and game world
  const soundManager = SoundManager.getInstance();
  soundManager.setSoundEnabled(soundEnabled);
  
  if (gameWorld && gameWorld.setSoundEnabled) {
    gameWorld.setSoundEnabled(soundEnabled);
  }
  
  // Refocus the canvas after sound toggle to maintain keyboard control
  setTimeout(() => {
    const canvas = document.getElementById("canvas");
    if (canvas) {
      canvas.focus();
    }
  }, 10);
}

function updateSoundIcon() {
  const soundIcon = document.getElementById("sound-icon");
  if (soundEnabled) {
    soundIcon.src = "./assets/icons/sound-on.svg";
    soundIcon.alt = "Sound On";
  } else {
    soundIcon.src = "./assets/icons/sound-off.svg";
    soundIcon.alt = "Sound Off";
  }
}

function startGame() {
  document.getElementById("main-menu").style.display = "none";
  document.getElementById("game-container").style.display = "flex";
  if (!gameStarted) {
    const canvas = document.getElementById("canvas");
    const keyboard = new Keyboard();
    gameWorld = new World(canvas, keyboard);
    window.world = gameWorld;
    gameWorld.setSoundEnabled(soundEnabled);
    gameWorld.startGame();
    setupMobileControls(keyboard);
    gameStarted = true;
    
    // Focus the canvas to ensure keyboard input works
    setTimeout(() => {
      canvas.focus();
    }, 100);
  } else {
    if (gameWorld) {
      gameWorld.restartGame();
      // Refocus canvas after restart
      setTimeout(() => {
        const canvas = document.getElementById("canvas");
        if (canvas) {
          canvas.focus();
        }
      }, 100);
    }
  }
}

function showHowToPlay() {
  document.getElementById("main-menu").style.display = "none";
  document.getElementById("how-to-play-screen").style.display = "flex";
}

function backToMainMenu() {
  document.getElementById("how-to-play-screen").style.display = "none";
  document.getElementById("main-menu").style.display = "flex";
}

function showImpressum() {
  document.getElementById("main-menu").style.display = "none";
  document.getElementById("impressum-screen").style.display = "flex";
}

function backToMainMenuFromImpressum() {
  document.getElementById("impressum-screen").style.display = "none";
  document.getElementById("main-menu").style.display = "flex";
}

function checkMobileOrientation() {
  const overlay = document.getElementById("mobile-rotation-overlay");
  const isPortrait = window.innerHeight > window.innerWidth;
  const isMobile = window.innerWidth <= 768;
  if (isMobile && isPortrait) {
    overlay.style.display = "flex";
  } else {
    overlay.style.display = "none";
  }
}

function setupMobileControls(keyboard) {
  const leftBtn = document.getElementById("left-btn");
  const rightBtn = document.getElementById("right-btn");
  const jumpBtn = document.getElementById("jump-btn");
  const throwBtn = document.getElementById("throw-btn");

  // Touch Events für Mobile
  function addTouchEvents(button, key) {
    button.addEventListener("touchstart", (e) => {
      e.preventDefault();
      keyboard[key] = true;
    });
    
    button.addEventListener("touchend", (e) => {
      e.preventDefault();
      keyboard[key] = false;
    });
    
    button.addEventListener("touchcancel", (e) => {
      e.preventDefault();
      keyboard[key] = false;
    });
  }

  // Mouse Events für Desktop (falls jemand die Buttons mit Maus klickt)
  function addMouseEvents(button, key) {
    button.addEventListener("mousedown", (e) => {
      e.preventDefault();
      keyboard[key] = true;
    });
    
    button.addEventListener("mouseup", (e) => {
      e.preventDefault();
      keyboard[key] = false;
    });
    
    button.addEventListener("mouseleave", (e) => {
      e.preventDefault();
      keyboard[key] = false;
    });
  }

  // Events für alle Buttons hinzufügen
  addTouchEvents(leftBtn, "LEFT");
  addTouchEvents(rightBtn, "RIGHT");
  addTouchEvents(jumpBtn, "UP");
  addTouchEvents(throwBtn, "SPACE");

  addMouseEvents(leftBtn, "LEFT");
  addMouseEvents(rightBtn, "RIGHT");
  addMouseEvents(jumpBtn, "UP");
  addMouseEvents(throwBtn, "SPACE");
}

window.addEventListener("load", checkMobileOrientation);
window.addEventListener("resize", checkMobileOrientation);
window.addEventListener("orientationchange", () => {
  setTimeout(checkMobileOrientation, 100);
});
