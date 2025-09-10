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
    this.xMin = xMin;
    this.xMax = xMax;
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
    this.deadSound = new Audio("assets/audio/chicken.mp3");
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
    
    const deadImages = this.type === 2 ? this.IMAGES_DEAD2 : this.IMAGES_DEAD1;
    this.loadImages(deadImages);
    this.currentImage = 0;
    this.img = this.imageCache[deadImages[0]];
    
    let deadFrameCount = 0;
    const deadAnimation = setInterval(() => {
      if (deadFrameCount < deadImages.length) {
        this.img = this.imageCache[deadImages[deadFrameCount]];
        deadFrameCount++;
      } else {
        clearInterval(deadAnimation);
        this.img = this.imageCache[deadImages[deadImages.length - 1]];
      }
    }, 200);
    
    setTimeout(() => {
      this.width = 0;
      this.height = 0;
      clearInterval(deadAnimation);
    }, 1000);
    
    try {
      if (this.deadSound) {
        this.deadSound.currentTime = 0;
        this.deadSound.play();
      }
    } catch (e) {}
  }

  resetPosition() {
    this.x = Math.random() * (this.xMax - this.xMin) + this.xMin;
    this.y = 360;
    if (this.type === 2) {
      this.y = 360 + (60 - this.height);
    }
  }
}
