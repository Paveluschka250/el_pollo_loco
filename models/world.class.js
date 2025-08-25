class World {
  canvas;
  ctx;
  character = new Character();
  chickens = [new Chicken(), new Chicken(), new Chicken()];
  clouds = [new Cloud(), new Cloud(), new Cloud()];
  background = [
    new Background("assets/img/5_background/layers/air.png"),
    new Background("assets/img/5_background/layers/3_third_layer/1.png"),
    new Background("assets/img/5_background/layers/2_second_layer/1.png"),
    new Background("assets/img/5_background/layers/1_first_layer/1.png"),

  ];

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.addObjectsToMap(this.background);
    this.addObjectsToMap(this.clouds);
    this.addObjectsToMap(this.chickens);
    this.addToMap(this.character);
    requestAnimationFrame(this.draw.bind(this));
  }

  addObjectsToMap(objects){
    objects.forEach((obj) => {
      this.addToMap(obj);
    });
  }

  addToMap(mo) {
    this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
  }
}
