let gameStarted = false;
let gameWorld = null;
let backgroundMusic = null;

function init() {
  setupMenuEventListeners();
  setupBackgroundMusic();
}

function setupBackgroundMusic() {
  if (!backgroundMusic) {
    backgroundMusic = new Audio("assets/audio/background-music.mp3");
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
    backgroundMusic.preload = "auto";
    window.backgroundMusic = backgroundMusic;

    startBackgroundMusic();
  }
}

function startBackgroundMusic() {
  if (!backgroundMusic) return;
  const playMusic = () => {
    backgroundMusic.play().catch((e) => {});
  };
  playMusic();
  const startOnClick = () => {
    playMusic();
    document.removeEventListener("click", startOnClick);
    document.removeEventListener("keydown", startOnClick);
  };
  document.addEventListener("click", startOnClick);
  document.addEventListener("keydown", startOnClick);
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

function startGame() {
  document.getElementById("main-menu").style.display = "none";
  document.getElementById("game-container").style.display = "flex";
  if (!gameStarted) {
    const canvas = document.getElementById("canvas");
    const keyboard = new Keyboard();
    gameWorld = new World(canvas, keyboard, backgroundMusic);
    window.world = gameWorld;
    window.backgroundMusic = backgroundMusic;
    gameWorld.startGame();
    setupMobileControls(keyboard);
    gameStarted = true;
  } else {
    if (gameWorld) {
      gameWorld.restartGame();
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
