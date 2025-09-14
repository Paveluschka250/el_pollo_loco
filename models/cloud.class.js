class Cloud extends MovableObject {
  /**
   * Creates a new Cloud instance
   * @param {number} xMin - Minimum x position
   * @param {number} xMax - Maximum x position
   * @param {string} imagePath - Path to cloud image
   */
  constructor(xMin = 0, xMax = 500, imagePath = "assets/img/5_background/layers/4_clouds/1.png") {
    super();
    this.loadImage(imagePath);
    this.x = Math.random() * (xMax - xMin) + xMin;
    this.y = Math.random() * 50;
    this.width = 300;
    this.height = 150;
    this.speed = 0.75 + Math.random() * 0.25;
    this.animate();
  }



  /**
   * Animates the cloud by moving it left and resetting position
   */
  animate() {
    setInterval(() => {
      this.moveLeft();
      if (this.x + this.width < -1000) {
        this.x = 3000; 
      }
    }, 1000 / 60);
  }
}
