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
    this.throwSound = new Audio('assets/audio/throw.mp3');
    this.x = x;
    this.y = y;
    this.width = 80;
    this.height = 80;
    this.offset = {
      left: 26,
      top: 15,
      bottom: 12,
      right: 26,
    };
    this.throw();
    this.animateRotation();
  }
  throw() {
    this.speedY = 15;
    try {
      this.throwSound.currentTime = 0;
      this.throwSound.play();
    } catch (e) {}
    this.applyGravity();
    setInterval(() => {
        this.x += 15   ;
    }, 1000 / 60);
  }
  animateRotation() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_BOTTLE);
    }, 1000 / 15);
  }
}