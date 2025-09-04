class Chicken extends MovableObject {
  IMAGES_WALKING_1 = [
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];
  IMAGES_WALKING_2 = [
    "assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  IMAGES_DEAD1 = [
    "assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png",
  ];
  IMAGES_DEAD2 = [
    "assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png",
  ];

  IMAGES_DEAD1 = [
    "assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png",
  ];
  IMAGES_DEAD2 = [
    "assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png",
  ];

  constructor(xMin = 200, xMax = 700, type = 1) {
    super();
    this.type = type;
    this.IMAGES_WALKING = type === 2 ? this.IMAGES_WALKING_2 : this.IMAGES_WALKING_1;
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.x = Math.random() * (xMax - xMin) + xMin;
    this.y = 360;
    if (type === 2) {
      this.width = 60;
      this.height = 60;
      this.y = 360 + (60 - this.height);
    } else {
      this.width = 60;
      this.height = 60;
    }
    this.speed = 0.5 + Math.random() * 0.75;
    this.offset = {
      left: 5,
      top: 5,
      bottom: 5,
      right: 5
    };
    this.isDead = false;
    this.animate();
  }

  animate() {
    this.animationInterval = setInterval(() => {
      if (!this.isDead) {
        this.moveLeft();
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 100);
  }

  playDead() {
    if (this.isDead) return;
    this.isDead = true;
    this.speed = 0;
    const deadImg = (this.type === 2 ? this.IMAGES_DEAD2 : this.IMAGES_DEAD1)[0];
    this.loadImage(deadImg);
  }
}
