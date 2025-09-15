class World {
  canvas;
  ctx;
  keyboard;
  camera_x;
  character = new Character();
  level = level;
  spaceWasDown = false;
  statusbar = [
    Object.assign(new Statusbar("health"), { y: -10 }),
    Object.assign(new Statusbar("coins"), { y: 30 }),
    Object.assign(new Statusbar("bottle"), { y: 70 }),
  ];
  endbossBar = new Statusbar("endboss");
  endscreen = new Endscreen();
  throwableObjects = [];
  backgroundMusic = null;
  gameRunning = false;
  gameIntervals = [];
  soundEnabled = true;
  collisionManager;
  gameRenderer;
  gameStateManager;

  /**
   * Creates a new World instance
   * @param {HTMLCanvasElement} canvas - Game canvas element
   * @param {Object} keyboard - Keyboard input handler
   */
  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.camera_x = 0;
    this.backgroundMusic = null;
    this.initManagers();
    this.initBackgroundMusic();
    this.draw();
    this.setWorld();
    this.run();
    this.setupEventListeners();
    this.setupKeyboardEvents();
  }

  /**
   * Initializes all game managers
   */
  initManagers() {
    this.collisionManager = new CollisionManager(this);
    this.gameRenderer = new GameRenderer(this);
    this.gameStateManager = new GameStateManager(this);
  }

  /**
   * Starts the game
   */
  startGame() {
    this.gameRunning = true;
    this.startBackgroundMusic();
  }

  /**
   * Initializes background music
   */
  initBackgroundMusic() {
    this.soundManager = SoundManager.getInstance();
    this.backgroundMusic = this.soundManager.createSound("assets/audio/background-music.mp3", { 
      loop: true, 
      volume: 0.3 
    });
  }

  /**
   * Starts playing background music
   */
  startBackgroundMusic() {
    if (!this.backgroundMusic || !this.soundEnabled) return;
    this.soundManager.playSound(this.backgroundMusic);
  }

  /**
   * Stops playing background music
   */
  stopBackgroundMusic() {
    this.soundManager.stopSound(this.backgroundMusic);
  }

  /**
   * Sets sound enabled state and manages background music accordingly
   * Resumes walk sound if character is moving when sound is re-enabled
   * @param {boolean} enabled - Whether sound is enabled
   */
  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
    this.soundManager.setSoundEnabled(enabled);
    if (enabled && this.gameRunning) {
      this.startBackgroundMusic();
      if (this.character && this.character.walkSound && this.character.walkSound.paused) {
        this.character.startWalkSound();
      }
    } else if (!enabled) {
      this.stopBackgroundMusic();
    }
  }

  /**
   * Sets up event listeners for the canvas
   */
  setupEventListeners() {
    this.canvas.addEventListener("click", (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      this.endscreen.handleClick(mouseX, mouseY);
    });
  }

  /**
   * Sets up keyboard event handlers
   */
  setupKeyboardEvents() {
    this.removeExistingKeyboardListeners();
    this.createKeyboardHandlers();
    this.addKeyboardListeners();
  }

  /**
   * Removes existing keyboard event listeners
   */
  removeExistingKeyboardListeners() {
    if (this.keyboardHandler) {
      window.removeEventListener("keydown", this.keyboardHandler);
      window.removeEventListener("keyup", this.keyboardHandler);
    }
  }

  /**
   * Creates keyboard event handlers
   */
  createKeyboardHandlers() {
    this.keyboardHandler = (e) => this.handleKeyDown(e);
    this.keyboardUpHandler = (e) => this.handleKeyUp(e);
  }

  /**
   * Handles key down events
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleKeyDown(e) {
    if (e.key === "ArrowRight") {
      this.keyboard.RIGHT = true;
    }
    if (e.key === "ArrowLeft") {
      this.keyboard.LEFT = true;
    }
    if (e.key === "ArrowUp") {
      this.keyboard.UP = true;
    }
    if (e.key === "ArrowDown") {
      this.keyboard.DOWN = true;
    }
    if (e.key === " ") {
      this.keyboard.SPACE = true;
    }
  }

  /**
   * Handles key up events
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleKeyUp(e) {
    if (e.key === "ArrowRight") {
      this.keyboard.RIGHT = false;
    }
    if (e.key === "ArrowLeft") {
      this.keyboard.LEFT = false;
    }
    if (e.key === "ArrowUp") {
      this.keyboard.UP = false;
    }
    if (e.key === "ArrowDown") {
      this.keyboard.DOWN = false;
    }
    if (e.key === " ") {
      this.keyboard.SPACE = false;
    }
  }

  /**
   * Adds keyboard event listeners to window
   */
  addKeyboardListeners() {
    window.addEventListener("keydown", this.keyboardHandler);
    window.addEventListener("keyup", this.keyboardUpHandler);
  }


  /**
   * Sets world reference for game objects
   */
  setWorld() {
    this.character.world = this;
    const boss = this.level.chickens.find((e) => e instanceof Endboss);
    if (boss) {
      boss.world = this;
    }
  }

  /**
   * Starts the main game loop running at ~60 FPS
   * Handles all collision detection, game state updates, and game end conditions
   */
  run() {
    const gameLoop = setInterval(() => {
      if (this.gameRunning) {
        this.collisionManager.checkCollisions();
        this.collisionManager.checkCollisionsCoins();
        this.collisionManager.checkCollisionsBottles();
        this.gameStateManager.checkThrowableObjects();
        this.collisionManager.checkBottleHitsChickens();
        this.collisionManager.checkEndbossBottles();
        this.gameStateManager.checkGameEnd();
      }
    }, 16);
    this.gameIntervals.push(gameLoop);
  }

  /**
   * Pauses the game
   */
  pauseGame() {
    this.gameStateManager.pauseGame();
  }

  /**
   * Resumes the game
   */
  resumeGame() {
    this.gameStateManager.resumeGame();
  }


  /**
   * Draws the game world
   */
  draw() {
    this.gameRenderer.draw();
  }

  /**
   * Restarts the game
   */
  restartGame() {
    this.gameStateManager.restartGame();
  }

}
