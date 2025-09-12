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

  constructor(canvas, keyboard, music = null) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.camera_x = 0;
    this.backgroundMusic = music;
    this.draw();
    this.setWorld();
    this.run();
    this.setupEventListeners();
    this.setupKeyboardEvents();
  }

  startGame() {
    this.gameRunning = true;
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
        this.checkCollisions();
        this.checkCollisionsCoins();
        this.checkCollisionsBottles();
        this.checkThrowableObjects();
        this.checkBottleHitsChickens();
        this.checkEndbossBottles();
        this.checkGameEnd();
      }
    }, 16);
    this.gameIntervals.push(gameLoop);
  }

  pauseGame() {
    this.gameRunning = false;
  }

  resumeGame() {
    this.gameRunning = true;
  }

  checkGameEnd() {
    if (this.character.die() && !this.endscreen.visible) {
      this.endscreen.showLose();
    }

    const boss = this.level.chickens.find((e) => e instanceof Endboss);
    if (boss && boss.isDead && boss.width === 0 && !this.endscreen.visible) {
      this.endscreen.showWin();
    }
  }

  checkThrowableObjects() {
    if (this.endscreen && this.endscreen.visible) {
      return;
    }
    if (this.keyboard.SPACE && !this.spaceWasDown) {
      const bottleBar = this.statusbar[2];
      const available = bottleBar?.percentage || 0;
      if (available >= 20) {
        const direction = this.character.otherDirection ? -1 : 1;
        let bottle = new ThrowableObject(
          this.character.x + 30,
          this.character.y + 100,
          direction
        );
        this.throwableObjects.push(bottle);
        bottleBar.setPercentage(Math.max(0, available - 20));
        this.spaceWasDown = true;
      }
    }
    if (!this.keyboard.SPACE) {
      this.spaceWasDown = false;
    }
  }

  checkCollisions() {
    this.level.chickens.forEach((chicken) => {
      if (this.character.isCollidingOffset(chicken)) {
        this.handleChickenCollision(chicken);
      }
    });
  }

  handleChickenCollision(chicken) {
    if (chicken instanceof Endboss) {
      this.handleEndbossCollision(chicken);
      return;
    }

    if (chicken.isDead) return;

    this.handleNormalChickenCollision(chicken);
  }

  handleEndbossCollision(chicken) {
    if (!chicken.isDead && !this.character.die()) {
      this.character.energy = 0;
      this.statusbar[0].setPercentage(this.character.energy);
    }
  }

  handleNormalChickenCollision(chicken) {
    const isStomp = this.checkStompCondition(chicken);
    if (isStomp && !chicken.isDead) {
      this.executeStomp(chicken);
    } else if (!chicken.isDead && !this.character.hurt()) {
      this.character.hit();
      this.statusbar[0].setPercentage(this.character.energy);
    }
  }

  checkStompCondition(chicken) {
    const characterBottom =
      this.character.y + this.character.height - this.character.offset.bottom;
    const chickenMidY = chicken.y + chicken.height / 2;
    const isAirborne = this.character.isAboveGround();
    return (
      isAirborne && this.character.speedY < 0 && characterBottom <= chickenMidY
    );
  }

  executeStomp(chicken) {
    chicken.playDead();
    this.character.y =
      chicken.y - (this.character.height - this.character.offset.bottom);
    this.character.speedY = 15;
  }

  checkCollisionsCoins() {
    for (let i = 0; i < this.level.coins.length; i++) {
      let coin = this.level.coins[i];
      if (this.character.isCollidingOffset(coin) && !coin.collected) {
        if (typeof coin.collect === "function") {
          coin.collect();
        }
        coin.collected = true;
        const coinsBar = this.statusbar[1];
        const newPercentage = Math.min(100, (coinsBar.percentage || 0) + 20);
        coinsBar.setPercentage(newPercentage);
        break;
      }
    }
  }

  checkCollisionsBottles() {
    for (let i = 0; i < this.level.bottles.length; i++) {
      let bottle = this.level.bottles[i];
      if (this.character.isCollidingOffset(bottle) && !bottle.collected) {
        if (typeof bottle.collect === "function") {
          bottle.collect();
        }
        bottle.collected = true;
        const bottleBar = this.statusbar[2];
        const newPercentage = Math.min(100, (bottleBar.percentage || 0) + 20);
        bottleBar.setPercentage(newPercentage);
        break;
      }
    }
  }

  draw() {
    this.clearCanvas();
    this.drawGameWorld();
    this.drawUI();
    this.drawOverlays();
    requestAnimationFrame(this.draw.bind(this));
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  drawGameWorld() {
    this.ctx.translate(this.camera_x, 0);
    this.drawBackground();
    this.drawCollectibles();
    this.drawClouds();
    this.drawChickens();
    this.drawEndbossBar();
    this.addToMap(this.character);
    this.ctx.translate(-this.camera_x, 0);
  }

  drawBackground() {
    this.addObjectsToMap(this.level.background);
  }

  drawCollectibles() {
    this.drawCoins();
    this.drawBottles();
  }

  drawCoins() {
    this.level.coins.forEach((coin) => {
      if (!coin.collected) {
        this.addToMap(coin);
      }
    });
  }

  drawBottles() {
    this.level.bottles.forEach((bottle) => {
      if (!bottle.collected) {
        this.addToMap(bottle);
      }
    });
  }

  drawClouds() {
    this.addObjectsToMap(this.level.clouds);
  }

  drawChickens() {
    this.level.chickens.forEach((chicken) => {
      this.addToMap(chicken);
    });
  }

  drawEndbossBar() {
    const boss = this.level.chickens.find((e) => e instanceof Endboss);
    if (boss && this.endbossBar && !boss.isDead) {
      this.positionEndbossBar(boss);
      this.addToMap(this.endbossBar);
    }
  }

  positionEndbossBar(boss) {
    this.endbossBar.x = boss.x + (boss.width - this.endbossBar.width) / 2;
    this.endbossBar.y = boss.y - 20;
  }

  drawUI() {
    this.addObjectsToMap(this.statusbar);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.throwableObjects);
    this.drawEndbossBottles();
    this.ctx.translate(-this.camera_x, 0);
  }

  drawOverlays() {
    this.endscreen.draw(this.ctx);
  }

  drawEndbossBottles() {
    const boss = this.level.chickens.find((e) => e instanceof Endboss);
    if (boss && boss.getThrownBottles) {
      const endbossBottles = boss.getThrownBottles();
      endbossBottles.forEach((bottle) => {
        this.addToMap(bottle);
      });
    }
  }

  addObjectsToMap(objects) {
    objects.forEach((obj) => {
      this.addToMap(obj);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);
    mo.drawFrameOffset(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  checkBottleHitsChickens() {
    for (let b = 0; b < this.throwableObjects.length; b++) {
      const bottle = this.throwableObjects[b];
      this.checkBottleAgainstChickens(bottle);
    }
  }

  checkEndbossBottles() {
    const boss = this.level.chickens.find((e) => e instanceof Endboss);
    if (boss && boss.getThrownBottles) {
      const endbossBottles = boss.getThrownBottles();
      for (let b = 0; b < endbossBottles.length; b++) {
        const bottle = endbossBottles[b];
        this.checkEndbossBottleAgainstCharacter(bottle);
      }
    }
  }

  checkEndbossBottleAgainstCharacter(bottle) {
    if (bottle.hasLanded || bottle.removed) return;
    
    if (bottle.isCollidingOffset(this.character)) {
      this.handleEndbossBottleHitCharacter(bottle);
    }
  }

  handleEndbossBottleHitCharacter(bottle) {
    if (!this.character.die()) {
      this.character.hit();
      this.statusbar[0].setPercentage(this.character.energy);
    }
    this.removeEndbossBottle(bottle);
  }

  removeEndbossBottle(bottle) {
    const boss = this.level.chickens.find((e) => e instanceof Endboss);
    if (boss && boss.thrownBottles) {
      const index = boss.thrownBottles.indexOf(bottle);
      if (index > -1) {
        boss.thrownBottles.splice(index, 1);
      }
    }
  }

  checkBottleAgainstChickens(bottle) {
    if (bottle.hasLanded || bottle.removed) return;
    
    for (let c = 0; c < this.level.chickens.length; c++) {
      const chicken = this.level.chickens[c];
      if (bottle.isCollidingOffset(chicken)) {
        this.handleBottleChickenCollision(bottle, chicken);
        break;
      }
    }
  }

  handleBottleChickenCollision(bottle, chicken) {
    if (chicken instanceof Endboss) {
      this.handleBottleEndbossCollision(bottle, chicken);
    } else if (!chicken.isDead) {
      this.handleBottleNormalChickenCollision(bottle, chicken);
    }
  }

  handleBottleEndbossCollision(bottle, chicken) {
    if (!chicken.isDead && !chicken.isHurt && typeof chicken.takeHit === "function") {
      chicken.takeHit();
    }
    this.removeBottleAfterHit(bottle);
  }

  handleBottleNormalChickenCollision(bottle, chicken) {
    chicken.playDead();
    this.removeBottleAfterHit(bottle);
  }

  removeBottleAfterHit(bottle) {
    if (typeof bottle.onLand === "function") {
      bottle.onLand();
    }
    setTimeout(() => {
      const idxBottle = this.throwableObjects.indexOf(bottle);
      if (idxBottle >= 0) this.throwableObjects.splice(idxBottle, 1);
    }, 400);
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  restartGame() {
    this.resetEndscreen();
    this.resetCharacter();
    this.resetGameState();
    this.resetStatusbars();
    this.resetChickens();
    this.resetCollectibles();
    this.resetThrowableObjects();
    this.resetCanvas();
    this.setupKeyboardEvents();
    this.setWorld();
  }

  resetEndscreen() {
    this.endscreen.hide();
    this.endscreen.visible = false;
    this.endscreen.type = null;
    this.endscreen.currentImage = null;
    this.endscreen.img = null;
  }

  resetCharacter() {
    if (this.character && this.character.stopAllIntervals) {
      this.character.stopAllIntervals();
    }
    this.character = new Character();
    this.character.world = this;
  }

  resetGameState() {
    this.camera_x = 0;
    this.level = level;
    this.gameRunning = true;
    this.spaceWasDown = false;
  }

  resetStatusbars() {
    this.statusbar = [
      Object.assign(new Statusbar("health"), { y: -10 }),
      Object.assign(new Statusbar("coins"), { y: 30 }),
      Object.assign(new Statusbar("bottle"), { y: 70 }),
    ];
    this.statusbar[0].setPercentage(100);
    this.statusbar[1].setPercentage(0);
    this.statusbar[2].setPercentage(0);
    this.endbossBar = new Statusbar("endboss");
  }

  resetChickens() {
    this.level.chickens.forEach((chicken) => {
      chicken.world = this;
      if (chicken instanceof Endboss) {
        this.resetEndboss(chicken);
      } else {
        this.resetNormalChicken(chicken);
      }
    });
  }

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

  resetNormalChicken(chicken) {
    chicken.isDead = false;
    chicken.currentImage = 0;
    chicken.img = chicken.imageCache[chicken.IMAGES_WALKING[0]];
    chicken.speed = 0.5 + Math.random() * 0.75;
    chicken.width = 60;
    chicken.height = 60;
    chicken.resetPosition();
  }

  resetCollectibles() {
    this.level.coins.forEach((coin) => {
      coin.world = this;
      coin.collected = false;
    });
    this.level.bottles.forEach((bottle) => {
      bottle.world = this;
      bottle.collected = false;
    });
  }

  resetThrowableObjects() {
    this.throwableObjects = [];
  }

  resetCanvas() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

}
