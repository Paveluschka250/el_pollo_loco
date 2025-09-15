class GameRenderer {
  /**
   * Creates a new GameRenderer instance
   * @param {World} world - World instance
   */
  constructor(world) {
    this.world = world;
  }

  /**
   * Main draw method that renders the entire game in a continuous loop
   * Clears canvas, draws game world, UI elements, and overlays, then schedules next frame
   */
  draw() {
    this.clearCanvas();
    this.drawGameWorld();
    this.drawUI();
    this.drawOverlays();
    requestAnimationFrame(this.draw.bind(this));
  }

  /**
   * Clears the canvas
   */
  clearCanvas() {
    this.world.ctx.clearRect(0, 0, this.world.canvas.width, this.world.canvas.height);
  }

  /**
   * Draws the main game world with camera offset applied
   * Renders background, collectibles, clouds, chickens, endboss bar, and character
   */
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

  /**
   * Draws the background
   */
  drawBackground() {
    this.addObjectsToMap(this.world.level.background);
  }

  /**
   * Draws all collectible items
   */
  drawCollectibles() {
    this.drawCoins();
    this.drawBottles();
  }

  /**
   * Draws all uncollected coins
   */
  drawCoins() {
    this.world.level.coins.forEach((coin) => {
      if (!coin.collected) {
        this.addToMap(coin);
      }
    });
  }

  /**
   * Draws all uncollected bottles
   */
  drawBottles() {
    this.world.level.bottles.forEach((bottle) => {
      if (!bottle.collected) {
        this.addToMap(bottle);
      }
    });
  }

  /**
   * Draws all clouds
   */
  drawClouds() {
    this.addObjectsToMap(this.world.level.clouds);
  }

  /**
   * Draws all chickens
   */
  drawChickens() {
    this.world.level.chickens.forEach((chicken) => {
      this.addToMap(chicken);
    });
  }

  /**
   * Draws the endboss health bar
   */
  drawEndbossBar() {
    const boss = this.world.level.chickens.find((e) => e instanceof Endboss);
    if (boss && this.world.endbossBar && !boss.isDead) {
      this.positionEndbossBar(boss);
      this.addToMap(this.world.endbossBar);
    }
  }

  /**
   * Positions the endboss health bar above the boss
   * @param {Endboss} boss - Endboss instance
   */
  positionEndbossBar(boss) {
    this.world.endbossBar.x = boss.x + (boss.width - this.world.endbossBar.width) / 2;
    this.world.endbossBar.y = boss.y - 20;
  }

  /**
   * Draws the UI elements
   */
  drawUI() {
    this.addObjectsToMap(this.world.statusbar);
    this.world.ctx.translate(this.world.camera_x, 0);
    this.addObjectsToMap(this.world.throwableObjects);
    this.drawEndbossBottles();
    this.world.ctx.translate(-this.world.camera_x, 0);
  }

  /**
   * Draws overlay elements like endscreen
   */
  drawOverlays() {
    this.world.endscreen.draw(this.world.ctx);
  }

  /**
   * Draws bottles thrown by the endboss
   */
  drawEndbossBottles() {
    const boss = this.world.level.chickens.find((e) => e instanceof Endboss);
    if (boss && boss.getThrownBottles) {
      const endbossBottles = boss.getThrownBottles();
      endbossBottles.forEach((bottle) => {
        this.addToMap(bottle);
      });
    }
  }

  /**
   * Adds multiple objects to the map
   * @param {Array} objects - Array of objects to draw
   */
  addObjectsToMap(objects) {
    objects.forEach((obj) => {
      this.addToMap(obj);
    });
  }

  /**
   * Adds a single object to the map with proper horizontal flipping if needed
   * @param {MovableObject} mo - Movable object to draw on canvas
   */
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

  /**
   * Flips an image horizontally
   * @param {MovableObject} mo - Movable object to flip
   */
  flipImage(mo) {
    this.world.ctx.save();
    this.world.ctx.translate(mo.width, 0);
    this.world.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores image flip
   * @param {MovableObject} mo - Movable object to restore
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.world.ctx.restore();
  }
}
