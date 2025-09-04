class World {
  canvas;
  ctx;
  keyboard;
  camera_x;
  character = new Character();
  level = level;
  statusbar = [
    Object.assign(new Statusbar('health'), { y: -10 }),
    Object.assign(new Statusbar('coins'), { y: 30 }),
    Object.assign(new Statusbar('bottle'), { y: 70 })
  ];
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
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkCollisionsCoins();
      this.checkThrowableObjects();
    }, 16);
  }

  checkThrowableObjects() {
    if (this.keyboard.SPACE) {
      let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
      this.throwableObjects.push(bottle);
    }
  }


  checkCollisions() {
    this.level.chickens.forEach((chicken) => {
      if (this.character.isCollidingOffset(chicken)) {
        this.character.hit();
        this.statusbar[0].setPercentage(this.character.energy);
        console.log("Kollision mit Huhn erkannt!");

      }
    });
  }

  checkCollisionsCoins() {
    for (let i = 0; i < this.level.coins.length; i++) {
      let coin = this.level.coins[i];
      if (this.character.isCollidingOffset(coin)) {
        console.log('Kollision mit Coin erkannt!');
        // Sound über Coin-Instanz abspielen
        if (typeof coin.collect === 'function') {
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

  

  draw() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.background);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.chickens);
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
