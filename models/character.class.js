class Character extends MovableObject {
  IMAGES_WALKING = [
    "assets/img/2_character_pepe/2_walk/W-21.png",
    "assets/img/2_character_pepe/2_walk/W-22.png",
    "assets/img/2_character_pepe/2_walk/W-23.png",
    "assets/img/2_character_pepe/2_walk/W-24.png",
    "assets/img/2_character_pepe/2_walk/W-25.png",
    "assets/img/2_character_pepe/2_walk/W-26.png",
  ];
  world;

  constructor() {
    super();
    this.loadImage("assets/img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadImages(this.IMAGES_WALKING);
    this.x = 100; // Initial x position
    this.y = 100; // Initial y position
    this.width = 120; // Initial width
    this.height = 200; // Initial height
    this.speed = 6;
    this.animate();
    this.applyGravity();
  }

  animate() {
    setInterval(() => {
      if (this.world.keyboard.RIGHT && this.x < 2200) {
        this.x += this.speed;
        this.otherDirection = false;
      }
      if (this.world.keyboard.LEFT && this.x > -600) {
        this.x -= this.speed;
        this.otherDirection = true;
      }
      this.world.camera_x = -this.x + 100;
    }, 1000 / 60);
    setInterval(() => {
      if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        this.currentImage =
          (this.currentImage + 1) % this.IMAGES_WALKING.length;
        this.img = this.imageCache[this.IMAGES_WALKING[this.currentImage]];
      }
    }, 50);
  }
}
