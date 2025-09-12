class ThrowableObject extends MovableObject {
  IMAGES_BOTTLE = [
    "assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];
  IMAGES_BOTTLE_BROKEN = [
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ]
  constructor(x, y, direction = 1) {
    super();
    this.loadImage(this.IMAGES_BOTTLE[0]);
    this.loadImages(this.IMAGES_BOTTLE);
    this.loadImages(this.IMAGES_BOTTLE_BROKEN);
    this.throwSound = new Audio('assets/audio/throw.mp3');
    this.x = x;
    this.y = y;
    this.width = 80;
    this.height = 80;
    this.groundY = 360;
    this.direction = direction;
    this.offset = {
      left: 26,
      top: 15,
      bottom: 12,
      right: 26,
    };
    this.hasLanded = false;
    this.removed = false;
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
    this.moveInterval = setInterval(() => {
        if (this.hasLanded) return;
        this.x += 5 * this.direction;
        if (this.y >= this.groundY) {
          this.onLand();
        }
    }, 1000 / 60);
  }
  animateRotation() {
    this.rotationInterval = setInterval(() => {
      if (this.hasLanded) return;
      this.playAnimation(this.IMAGES_BOTTLE);
      if (this.y >= this.groundY) {
        this.onLand();
      }
    }, 1000 / 15);
  }

  onLand() {
    if (this.hasLanded) return;
    this.hasLanded = true;
    this.y = this.groundY;
    if (this.moveInterval) clearInterval(this.moveInterval);
    if (this.rotationInterval) clearInterval(this.rotationInterval);
    this.playSplashOnce();
  }

  playSplashOnce() {
    const images = this.IMAGES_BOTTLE_BROKEN;
    let i = 0;
    const frameMs = 1000 / 20;
    this.splashInterval = setInterval(() => {
      if (i >= images.length) {
        clearInterval(this.splashInterval);
        this.removed = true;
        this.width = 0;
        this.height = 0;
        return;
      }
      const path = images[i];
      this.img = this.imageCache[path];
      i++;
    }, frameMs);
  }

  draw(ctx) {
    if (this.removed) return;
    
    if (this.direction === -1) {
      this.flipImage(ctx);
    }
    
    super.draw(ctx);
    
    if (this.direction === -1) {
      this.flipImageBack(ctx);
    }
  }

  flipImage(ctx) {
    ctx.save();
    ctx.translate(this.width, 0);
    ctx.scale(-1, 1);
    this.x = this.x * -1;
  }

  flipImageBack(ctx) {
    this.x = this.x * -1;
    ctx.restore();
  }

  isAboveGround() {
    return this.y < this.groundY;
  }
}