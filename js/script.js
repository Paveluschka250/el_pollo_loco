let gameStarted = false;
let gameWorld = null;
let soundEnabled = true;

/**
 * Initializes the game by setting up event listeners and sound toggle
 */
function init() {
  setupMenuEventListeners();
  setupSoundToggle();
}

/**
 * Sets up all menu button event listeners
 */
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

/**
 * Sets up sound toggle button with event listeners and initializes sound state
 */
function setupSoundToggle() {
  const soundToggleBtn = document.getElementById("sound-toggle-btn");
  const soundManager = SoundManager.getInstance();
  soundToggleBtn.addEventListener("click", handleSoundToggleClick);
  soundToggleBtn.addEventListener("keydown", preventKeyboardEvents);
  soundToggleBtn.addEventListener("keyup", preventKeyboardEvents);
  soundEnabled = soundManager.soundEnabled;
  updateSoundIcon();
}

/**
 * Handles sound toggle button click events
 * @param {Event} e - The click event
 */
function handleSoundToggleClick(e) {
  e.preventDefault();
  toggleSound();
}

/**
 * Prevents keyboard events from propagating to prevent interference with game controls
 * @param {Event} e - The keyboard event
 */
function preventKeyboardEvents(e) {
  e.preventDefault();
  e.stopPropagation();
}

/**
 * Toggles sound state and updates UI accordingly
 */
function toggleSound() {
  soundEnabled = !soundEnabled;
  updateSoundIcon();
  applySoundState();
  refocusCanvas();
}

/**
 * Applies sound state to sound manager and game world
 */
function applySoundState() {
  const soundManager = SoundManager.getInstance();
  soundManager.setSoundEnabled(soundEnabled);
  if (gameWorld && gameWorld.setSoundEnabled) {
    gameWorld.setSoundEnabled(soundEnabled);
  }
}

/**
 * Refocuses canvas after a short delay to ensure keyboard input works
 */
function refocusCanvas() {
  setTimeout(() => {
    const canvas = document.getElementById("canvas");
    if (canvas) {
      canvas.focus();
    }
  }, 10);
}

/**
 * Updates the sound icon based on current sound state
 */
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

/**
 * Starts the game by hiding menu and initializing or restarting game
 */
function startGame() {
  hideMainMenu();
  showGameContainer();
  if (!gameStarted) {
    initializeNewGame();
  } else {
    restartExistingGame();
  }
}

/**
 * Hides the main menu
 */
function hideMainMenu() {
  document.getElementById("main-menu").style.display = "none";
}

/**
 * Shows the game container
 */
function showGameContainer() {
  document.getElementById("game-container").style.display = "flex";
}

/**
 * Initializes a new game instance with canvas, keyboard, and mobile controls
 */
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

/**
 * Restarts an existing game instance
 */
function restartExistingGame() {
  if (gameWorld) {
    gameWorld.restartGame();
    focusCanvasAfterDelay();
  }
}

/**
 * Focuses canvas after a delay to ensure keyboard input works
 * @param {HTMLCanvasElement} canvas - Optional canvas element to focus
 */
function focusCanvasAfterDelay(canvas = null) {
  setTimeout(() => {
    const targetCanvas = canvas || document.getElementById("canvas");
    if (targetCanvas) {
      targetCanvas.focus();
    }
  }, 100);
}

/**
 * Shows the how to play screen
 */
function showHowToPlay() {
  hideMainMenu();
  document.getElementById("how-to-play-screen").style.display = "flex";
}

/**
 * Returns to main menu from how to play screen
 */
function backToMainMenu() {
  document.getElementById("how-to-play-screen").style.display = "none";
  showMainMenu();
}

/**
 * Shows the impressum screen
 */
function showImpressum() {
  hideMainMenu();
  document.getElementById("impressum-screen").style.display = "flex";
}

/**
 * Returns to main menu from impressum screen
 */
function backToMainMenuFromImpressum() {
  document.getElementById("impressum-screen").style.display = "none";
  showMainMenu();
}

/**
 * Shows the main menu
 */
function showMainMenu() {
  document.getElementById("main-menu").style.display = "flex";
}

/**
 * Checks mobile orientation and shows/hides rotation overlay accordingly
 */
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

/**
 * Shows the mobile rotation overlay
 * @param {HTMLElement} overlay - The overlay element to show
 */
function showMobileOverlay(overlay) {
  overlay.style.display = "flex";
}

/**
 * Hides the mobile rotation overlay
 * @param {HTMLElement} overlay - The overlay element to hide
 */
function hideMobileOverlay(overlay) {
  overlay.style.display = "none";
}

/**
 * Sets up mobile control buttons for touch and mouse events
 * @param {Keyboard} keyboard - The keyboard instance to control
 */
function setupMobileControls(keyboard) {
  const leftBtn = document.getElementById("left-btn");
  const rightBtn = document.getElementById("right-btn");
  const jumpBtn = document.getElementById("jump-btn");
  const throwBtn = document.getElementById("throw-btn");
  setupButtonEvents(leftBtn, rightBtn, jumpBtn, throwBtn, keyboard);
}

/**
 * Sets up touch and mouse events for all mobile control buttons
 * @param {HTMLElement} leftBtn - Left movement button
 * @param {HTMLElement} rightBtn - Right movement button
 * @param {HTMLElement} jumpBtn - Jump button
 * @param {HTMLElement} throwBtn - Throw button
 * @param {Keyboard} keyboard - The keyboard instance to control
 */
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

/**
 * Adds touch event listeners to a button for mobile controls
 * @param {HTMLElement} button - The button element
 * @param {string} key - The keyboard key to simulate
 * @param {Keyboard} keyboard - The keyboard instance to control
 */
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

/**
 * Adds mouse event listeners to a button for desktop controls
 * @param {HTMLElement} button - The button element
 * @param {string} key - The keyboard key to simulate
 * @param {Keyboard} keyboard - The keyboard instance to control
 */
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

/**
 * Handles orientation change events with a delay to ensure proper detection
 */
function handleOrientationChange() {
  setTimeout(checkMobileOrientation, 100);
}
