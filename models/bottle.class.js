class Bottle extends MovableObject {
    constructor(xMin = 0, xMax = 500, imagePath = "assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png") {
        super();
        this.loadImage(imagePath);
        this.x = Math.random() * (xMax - xMin) + xMin;
        this.y = 350;
        this.width = 80;
        this.height = 80;
        this.offset = {
          left: 26,
          top: 15,
          bottom: 12,
          right: 26,
        };
      }
  }
