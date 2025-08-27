class World {
  canvas;
  ctx;
  keyboard;
  camera_x;
  character = new Character();
  level = level;

  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
  }

  setWorld() {
    this.character.world = this;
  }

  draw() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.background);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.chickens);
    this.addToMap(this.character);
    this.ctx.translate(-this.camera_x, 0);
    requestAnimationFrame(this.draw.bind(this));
  }

  addObjectsToMap(objects){
    objects.forEach((obj) => {
      this.addToMap(obj);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.ctx.save();
      this.ctx.scale(-1, 1);
      this.ctx.drawImage(mo.img, -mo.x - mo.width, mo.y, mo.width, mo.height);
      this.ctx.restore();
    } else {
      this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
    }
  }


}
