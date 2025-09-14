class GameStateManager {
  /**
   * Creates a new GameStateManager instance
   * @param {World} world - World instance
   */
  constructor(world) {
    this.world = world;
  }

  /**
   * Checks if the game has ended (win or lose)
   */
  checkGameEnd() {
    if (this.world.character.die() && !this.world.endscreen.visible) {
      this.world.endscreen.showLose();
      this.world.stopBackgroundMusic();
    }

    const boss = this.world.level.chickens.find((e) => e instanceof Endboss);
    if (boss && boss.isDead && boss.width === 0 && !this.world.endscreen.visible) {
      this.world.endscreen.showWin();
      this.world.stopBackgroundMusic();
    }
  }

  /**
   * Checks and handles throwable objects (bottles)
   */
  checkThrowableObjects() {
    if (this.world.endscreen && this.world.endscreen.visible) {
      return;
    }
    if (this.world.keyboard.SPACE && !this.world.spaceWasDown) {
      const bottleBar = this.world.statusbar[2];
      const available = bottleBar?.percentage || 0;
      if (available >= 20) {
        const direction = this.world.character.otherDirection ? -1 : 1;
        let bottle = new ThrowableObject(
          this.world.character.x + 30,
          this.world.character.y + 100,
          direction
        );
        this.world.throwableObjects.push(bottle);
        bottleBar.setPercentage(Math.max(0, available - 20));
        this.world.spaceWasDown = true;
      }
    }
    if (!this.world.keyboard.SPACE) {
      this.world.spaceWasDown = false;
    }
  }

  /**
   * Pauses the game
   */
  pauseGame() {
    this.world.gameRunning = false;
  }

  /**
   * Resumes the game
   */
  resumeGame() {
    this.world.gameRunning = true;
  }

  /**
   * Restarts the game by resetting all game elements
   */
  restartGame() {
    this.resetEndscreen();
    this.resetCharacter();
    this.resetGameState();
    this.resetStatusbars();
    this.resetChickens();
    this.resetCollectibles();
    this.resetThrowableObjects();
    this.resetCanvas();
    this.world.setupKeyboardEvents();
    this.world.setWorld();
  }

  /**
   * Resets the endscreen
   */
  resetEndscreen() {
    this.world.endscreen.hide();
    this.world.endscreen.visible = false;
    this.world.endscreen.type = null;
    this.world.endscreen.currentImage = null;
    this.world.endscreen.img = null;
  }

  /**
   * Resets the character
   */
  resetCharacter() {
    if (this.world.character && this.world.character.stopAllIntervals) {
      this.world.character.stopAllIntervals();
    }
    this.world.character = new Character();
    this.world.character.world = this.world;
  }

  /**
   * Resets the game state
   */
  resetGameState() {
    this.world.camera_x = 0;
    this.world.level = level;
    this.world.gameRunning = true;
    this.world.spaceWasDown = false;
    if (this.world.soundEnabled) {
      this.world.startBackgroundMusic();
    }
  }

  /**
   * Resets all status bars
   */
  resetStatusbars() {
    this.world.statusbar = [
      Object.assign(new Statusbar("health"), { y: -10 }),
      Object.assign(new Statusbar("coins"), { y: 30 }),
      Object.assign(new Statusbar("bottle"), { y: 70 }),
    ];
    this.world.statusbar[0].setPercentage(100);
    this.world.statusbar[1].setPercentage(0);
    this.world.statusbar[2].setPercentage(0);
    this.world.endbossBar = new Statusbar("endboss");
  }

  /**
   * Resets all chickens
   */
  resetChickens() {
    this.world.level.chickens.forEach((chicken) => {
      chicken.world = this.world;
      if (chicken instanceof Endboss) {
        this.resetEndboss(chicken);
      } else {
        this.resetNormalChicken(chicken);
      }
    });
  }

  /**
   * Resets the endboss
   * @param {Endboss} chicken - Endboss instance to reset
   */
  resetEndboss(chicken) {
    chicken.isDead = false;
    chicken.isHurt = false;
    chicken.lives = 3;
    chicken.health = 100;
    chicken.state = "walking";
    chicken.alertPlayed = false;
    chicken.deadAnimationPlayed = false;
    chicken.deadFrameCount = 0;
    chicken.width = 300;
    chicken.height = 300;
    chicken.x = 2000;
    chicken.y = 150;
    chicken.speed = 0.15 + Math.random() * 0.25;
    chicken.hurtEndAt = 0;
    chicken.lastHitTime = 0;
    chicken.alertEndTime = 0;
    chicken.attackEndTime = 0;
    chicken.originalSpeed = chicken.speed;
    chicken.attackSpeed = chicken.originalSpeed * 20;
    chicken.deadAnimationEndTime = 0;
    chicken.lastDeadFrameAt = 0;
    chicken.currentImage = 0;
    chicken.img = chicken.imageCache[chicken.IMAGES_WALKING[0]];
    chicken.thrownBottles = [];
    chicken.lastBottleThrow = 0;
  }

  /**
   * Resets a normal chicken
   * @param {Chicken} chicken - Chicken instance to reset
   */
  resetNormalChicken(chicken) {
    chicken.isDead = false;
    chicken.currentImage = 0;
    chicken.img = chicken.imageCache[chicken.IMAGES_WALKING[0]];
    chicken.speed = 0.5 + Math.random() * 0.75;
    chicken.width = 60;
    chicken.height = 60;
    chicken.resetPosition();
  }

  /**
   * Resets all collectible items
   */
  resetCollectibles() {
    this.world.level.coins.forEach((coin) => {
      coin.world = this.world;
      coin.collected = false;
    });
    this.world.level.bottles.forEach((bottle) => {
      bottle.world = this.world;
      bottle.collected = false;
    });
  }

  /**
   * Resets throwable objects array
   */
  resetThrowableObjects() {
    this.world.throwableObjects = [];
  }

  /**
   * Resets the canvas transform
   */
  resetCanvas() {
    this.world.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}
