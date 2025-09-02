class Cloud extends MovableObject {
  constructor() {
    super();
    this.loadImage("assets/img/5_background/layers/4_clouds/1.png");
    this.x = Math.random() * 500;
    this.y = Math.random() * 50;
    this.width = 300;
    this.height = 150;
    this.speed = 20;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.moveLeft();
      if (this.x + this.width < -1000) {
        this.x = 3000; 
      }
    }, 1000 / 60);
  }

}
