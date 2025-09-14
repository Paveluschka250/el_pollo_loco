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
  const soundManager = SoundManager.getInstance();
  
  soundToggleBtn.addEventListener("click", handleSoundToggleClick);
  soundToggleBtn.addEventListener("keydown", preventKeyboardEvents);
  soundToggleBtn.addEventListener("keyup", preventKeyboardEvents);
  
  soundEnabled = soundManager.soundEnabled;
  updateSoundIcon();
}

function handleSoundToggleClick(e) {
  e.preventDefault();
  toggleSound();
}

function preventKeyboardEvents(e) {
  e.preventDefault();
  e.stopPropagation();
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  updateSoundIcon();
  applySoundState();
  refocusCanvas();
}

function applySoundState() {
  const soundManager = SoundManager.getInstance();
  soundManager.setSoundEnabled(soundEnabled);
  
  if (gameWorld && gameWorld.setSoundEnabled) {
    gameWorld.setSoundEnabled(soundEnabled);
  }
}

function refocusCanvas() {
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
  hideMainMenu();
  showGameContainer();
  
  if (!gameStarted) {
    initializeNewGame();
  } else {
    restartExistingGame();
  }
}

function hideMainMenu() {
  document.getElementById("main-menu").style.display = "none";
}

function showGameContainer() {
  document.getElementById("game-container").style.display = "flex";
}

function initializeNewGame() {
  const canvas = document.getElementById("canvas");
  const keyboard = new Keyboard();
  
  gameWorld = new World(canvas, keyboard);
  window.world = gameWorld;
  gameWorld.setSoundEnabled(soundEnabled);
  gameWorld.startGame();
  setupMobileControls(keyboard);
  gameStarted = true;
  
  focusCanvasAfterDelay(canvas);
}

function restartExistingGame() {
  if (gameWorld) {
    gameWorld.restartGame();
    focusCanvasAfterDelay();
  }
}

function focusCanvasAfterDelay(canvas = null) {
  setTimeout(() => {
    const targetCanvas = canvas || document.getElementById("canvas");
    if (targetCanvas) {
      targetCanvas.focus();
    }
  }, 100);
}

function showHowToPlay() {
  hideMainMenu();
  document.getElementById("how-to-play-screen").style.display = "flex";
}

function backToMainMenu() {
  document.getElementById("how-to-play-screen").style.display = "none";
  showMainMenu();
}

function showImpressum() {
  hideMainMenu();
  document.getElementById("impressum-screen").style.display = "flex";
}

function backToMainMenuFromImpressum() {
  document.getElementById("impressum-screen").style.display = "none";
  showMainMenu();
}

function showMainMenu() {
  document.getElementById("main-menu").style.display = "flex";
}

function checkMobileOrientation() {
  const overlay = document.getElementById("mobile-rotation-overlay");
  const isPortrait = window.innerHeight > window.innerWidth;
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile && isPortrait) {
    showMobileOverlay(overlay);
  } else {
    hideMobileOverlay(overlay);
  }
}

function showMobileOverlay(overlay) {
  overlay.style.display = "flex";
}

function hideMobileOverlay(overlay) {
  overlay.style.display = "none";
}

function setupMobileControls(keyboard) {
  const leftBtn = document.getElementById("left-btn");
  const rightBtn = document.getElementById("right-btn");
  const jumpBtn = document.getElementById("jump-btn");
  const throwBtn = document.getElementById("throw-btn");

  setupButtonEvents(leftBtn, rightBtn, jumpBtn, throwBtn, keyboard);
}

function setupButtonEvents(leftBtn, rightBtn, jumpBtn, throwBtn, keyboard) {
  addTouchEvents(leftBtn, "LEFT", keyboard);
  addTouchEvents(rightBtn, "RIGHT", keyboard);
  addTouchEvents(jumpBtn, "UP", keyboard);
  addTouchEvents(throwBtn, "SPACE", keyboard);

  addMouseEvents(leftBtn, "LEFT", keyboard);
  addMouseEvents(rightBtn, "RIGHT", keyboard);
  addMouseEvents(jumpBtn, "UP", keyboard);
  addMouseEvents(throwBtn, "SPACE", keyboard);
}

function addTouchEvents(button, key, keyboard) {
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

function addMouseEvents(button, key, keyboard) {
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

window.addEventListener("load", checkMobileOrientation);
window.addEventListener("resize", checkMobileOrientation);
window.addEventListener("orientationchange", handleOrientationChange);

function handleOrientationChange() {
  setTimeout(checkMobileOrientation, 100);
}
