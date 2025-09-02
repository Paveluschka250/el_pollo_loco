class ThrowableObject extends MovableObject {
  IMAGES_BOTTLE = [
    "assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];
  constructor(x, y) {
    super();
    this.loadImage(this.IMAGES_BOTTLE[0]);
    this.loadImages(this.IMAGES_BOTTLE);
    this.x = x;
    this.y = y;
    this.width = 200;
    this.height = 50;
    this.throw();
  }
  throw() {
    this.speedY = 10;
    this.applyGravity();
    setInterval(() => {
        this.x += 5;
    }, 1000 / 60);
  }
}