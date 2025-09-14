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

  initManagers() {
    this.collisionManager = new CollisionManager(this);
    this.gameRenderer = new GameRenderer(this);
    this.gameStateManager = new GameStateManager(this);
  }

  startGame() {
    this.gameRunning = true;
    this.startBackgroundMusic();
  }

  initBackgroundMusic() {
    this.soundManager = SoundManager.getInstance();
    this.backgroundMusic = this.soundManager.createSound("assets/audio/background-music.mp3", { 
      loop: true, 
      volume: 0.3 
    });
  }

  startBackgroundMusic() {
    if (!this.backgroundMusic || !this.soundEnabled) return;
    this.soundManager.playSound(this.backgroundMusic);
  }

  stopBackgroundMusic() {
    this.soundManager.stopSound(this.backgroundMusic);
  }

  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
    this.soundManager.setSoundEnabled(enabled);
    if (enabled && this.gameRunning) {
      this.startBackgroundMusic();
      // Resume walk sound if character is walking
      if (this.character && this.character.walkSound && this.character.walkSound.paused) {
        this.character.startWalkSound();
      }
    } else if (!enabled) {
      this.stopBackgroundMusic();
    }
  }

  setupEventListeners() {
    this.canvas.addEventListener("click", (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      this.endscreen.handleClick(mouseX, mouseY);
    });
  }

  setupKeyboardEvents() {
    this.removeExistingKeyboardListeners();
    this.createKeyboardHandlers();
    this.addKeyboardListeners();
  }

  removeExistingKeyboardListeners() {
    if (this.keyboardHandler) {
      window.removeEventListener("keydown", this.keyboardHandler);
      window.removeEventListener("keyup", this.keyboardHandler);
    }
  }

  createKeyboardHandlers() {
    this.keyboardHandler = (e) => this.handleKeyDown(e);
    this.keyboardUpHandler = (e) => this.handleKeyUp(e);
  }

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

  addKeyboardListeners() {
    window.addEventListener("keydown", this.keyboardHandler);
    window.addEventListener("keyup", this.keyboardUpHandler);
  }


  setWorld() {
    this.character.world = this;
    const boss = this.level.chickens.find((e) => e instanceof Endboss);
    if (boss) {
      boss.world = this;
    }
  }

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

  pauseGame() {
    this.gameStateManager.pauseGame();
  }

  resumeGame() {
    this.gameStateManager.resumeGame();
  }


  draw() {
    this.gameRenderer.draw();
  }

  restartGame() {
    this.gameStateManager.restartGame();
  }

}
