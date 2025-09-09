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
  throwableObjects = [];

  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
  }

  setWorld() {
    this.character.world = this;
    // Endboss-Bar in die Welt einhängen
    const boss = this.level.chickens.find((e) => e instanceof Endboss);
    if (boss) {
      boss.world = this;
    }
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkCollisionsCoins();
      this.checkCollisionsBottles();
      this.checkThrowableObjects();
      this.checkBottleHitsChickens();
    }, 16);
  }

  checkThrowableObjects() {
    if (this.keyboard.SPACE && !this.spaceWasDown) {
      const bottleBar = this.statusbar[2];
      const available = bottleBar?.percentage || 0;
      if (available >= 20) {
        let bottle = new ThrowableObject(
          this.character.x + 30,
          this.character.y + 100
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
        // Endboss: nur Schaden, kein Stomp möglich
        if (chicken instanceof Endboss) {
          if (!this.character.hurt()) {
            this.character.hit();
            this.statusbar[0].setPercentage(this.character.energy);
          }
          return;
        }
        
        // Normale Chickens: Stomp-Logik
        const characterBottom =
          this.character.y +
          this.character.height -
          this.character.offset.bottom;
        const chickenMidY = chicken.y + chicken.height / 2;
        const isAirborne = this.character.isAboveGround();
        const isStomp =
          isAirborne &&
          this.character.speedY < 0 &&
          characterBottom <= chickenMidY;
        if (isStomp && !chicken.isDead) {
          chicken.playDead();
          this.character.y =
            chicken.y - (this.character.height - this.character.offset.bottom);
          this.character.speedY = 15;
          setTimeout(() => {
            const idx = this.level.chickens.indexOf(chicken);
            if (idx >= 0) this.level.chickens.splice(idx, 1);
          }, 1000);
        } else if (!chicken.isDead && !this.character.hurt()) {
          this.character.hit();
          this.statusbar[0].setPercentage(this.character.energy);
        }
      }
    });
  }

  checkCollisionsCoins() {
    for (let i = 0; i < this.level.coins.length; i++) {
      let coin = this.level.coins[i];
      if (this.character.isCollidingOffset(coin)) {
        console.log("Kollision mit Coin erkannt!");
        // Sound über Coin-Instanz abspielen
        if (typeof coin.collect === "function") {
          coin.collect();
        }
        this.level.coins.splice(i, 1);
        // Coins-Statusbar um eine Stufe (20%) erhöhen
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
      if (this.character.isCollidingOffset(bottle)) {
        console.log("Kollision mit Bottle erkannt!");
        if (typeof bottle.collect === "function") {
          bottle.collect();
        }
        this.level.bottles.splice(i, 1);0
        const bottleBar = this.statusbar[2];
        const newPercentage = Math.min(100, (bottleBar.percentage || 0) + 20);
        bottleBar.setPercentage(newPercentage);
        break;
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.background);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.chickens);
    // Endboss-Bar über dem Boss positionieren
    const boss = this.level.chickens.find((e) => e instanceof Endboss);
    if (boss && this.endbossBar) {
      this.endbossBar.x = boss.x + (boss.width - this.endbossBar.width) / 2;
      this.endbossBar.y = boss.y - 20;
      this.addToMap(this.endbossBar);
    }
    this.addToMap(this.character);
    this.ctx.translate(-this.camera_x, 0);
    this.addObjectsToMap(this.statusbar);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);
    requestAnimationFrame(this.draw.bind(this));
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
      for (let c = 0; c < this.level.chickens.length; c++) {
        const chicken = this.level.chickens[c];
        if (bottle.isCollidingOffset(chicken)) {
          // Treffer auf Endboss: 1s Hurt-Animation, stehen bleiben, nicht entfernen
          if (chicken instanceof Endboss) {
            if (typeof chicken.takeHit === "function") {
              chicken.takeHit();
            }
            if (typeof bottle.onLand === "function") {
              bottle.onLand();
            }
            setTimeout(() => {
              const idxBottle = this.throwableObjects.indexOf(bottle);
              if (idxBottle >= 0) this.throwableObjects.splice(idxBottle, 1);
            }, 400);
            break;
          }
          // Normales Chicken: töten und entfernen
          if (!chicken.isDead) {
            chicken.playDead();
            if (typeof bottle.onLand === "function") {
              bottle.onLand();
            }
            setTimeout(() => {
              const idxBottle = this.throwableObjects.indexOf(bottle);
              if (idxBottle >= 0) this.throwableObjects.splice(idxBottle, 1);
            }, 400);
            setTimeout(() => {
              const idx = this.level.chickens.indexOf(chicken);
              if (idx >= 0) this.level.chickens.splice(idx, 1);
            }, 1000);
            break;
          }
        }
      }
    }
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
}
