class GameRenderer {
  constructor(world) {
    this.world = world;
  }

  draw() {
    this.clearCanvas();
    this.drawGameWorld();
    this.drawUI();
    this.drawOverlays();
    requestAnimationFrame(this.draw.bind(this));
  }

  clearCanvas() {
    this.world.ctx.clearRect(0, 0, this.world.canvas.width, this.world.canvas.height);
  }

  drawGameWorld() {
    this.world.ctx.translate(this.world.camera_x, 0);
    this.drawBackground();
    this.drawCollectibles();
    this.drawClouds();
    this.drawChickens();
    this.drawEndbossBar();
    this.addToMap(this.world.character);
    this.world.ctx.translate(-this.world.camera_x, 0);
  }

  drawBackground() {
    this.addObjectsToMap(this.world.level.background);
  }

  drawCollectibles() {
    this.drawCoins();
    this.drawBottles();
  }

  drawCoins() {
    this.world.level.coins.forEach((coin) => {
      if (!coin.collected) {
        this.addToMap(coin);
      }
    });
  }

  drawBottles() {
    this.world.level.bottles.forEach((bottle) => {
      if (!bottle.collected) {
        this.addToMap(bottle);
      }
    });
  }

  drawClouds() {
    this.addObjectsToMap(this.world.level.clouds);
  }

  drawChickens() {
    this.world.level.chickens.forEach((chicken) => {
      this.addToMap(chicken);
    });
  }

  drawEndbossBar() {
    const boss = this.world.level.chickens.find((e) => e instanceof Endboss);
    if (boss && this.world.endbossBar && !boss.isDead) {
      this.positionEndbossBar(boss);
      this.addToMap(this.world.endbossBar);
    }
  }

  positionEndbossBar(boss) {
    this.world.endbossBar.x = boss.x + (boss.width - this.world.endbossBar.width) / 2;
    this.world.endbossBar.y = boss.y - 20;
  }

  drawUI() {
    this.addObjectsToMap(this.world.statusbar);
    this.world.ctx.translate(this.world.camera_x, 0);
    this.addObjectsToMap(this.world.throwableObjects);
    this.drawEndbossBottles();
    this.world.ctx.translate(-this.world.camera_x, 0);
  }

  drawOverlays() {
    this.world.endscreen.draw(this.world.ctx);
  }

  drawEndbossBottles() {
    const boss = this.world.level.chickens.find((e) => e instanceof Endboss);
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

    mo.draw(this.world.ctx);
    mo.drawFrame(this.world.ctx);
    mo.drawFrameOffset(this.world.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.world.ctx.save();
    this.world.ctx.translate(mo.width, 0);
    this.world.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.world.ctx.restore();
  }
}
