class World {
  canvas;
  ctx;
  character = new Character();
  chickens = [new Chicken(), new Chicken(), new Chicken()];
  clouds = [new Cloud(), new Cloud(), new Cloud()];
  background = new Background();

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.clouds.forEach((cloud) => {
      this.addToMap(cloud);
    });
    this.chickens.forEach((chicken) => {
      this.addToMap(chicken);
    });
    this.addToMap(this.character);
    requestAnimationFrame(this.draw.bind(this));
  }

  addToMap(mo) {
    this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
  }
}
