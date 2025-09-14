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
  ];
  /**
   * Creates a new ThrowableObject instance
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} direction - Direction (1 or -1)
   */
  constructor(x, y, direction = 1) {
    super();
    this.soundManager = SoundManager.getInstance();
    this.loadImage(this.IMAGES_BOTTLE[0]);
    this.loadImages(this.IMAGES_BOTTLE);
    this.loadImages(this.IMAGES_BOTTLE_BROKEN);
    this.throwSound = this.soundManager.createSound("assets/audio/throw.mp3");
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
  /**
   * Throws the bottle with physics
   */
  throw() {
    this.speedY = 15;
    this.soundManager.playSound(this.throwSound);
    this.applyGravity();
    this.moveInterval = setInterval(() => {
        if (this.hasLanded) return;
        this.x += 5 * this.direction;
        if (this.y >= this.groundY) {
          this.onLand();
        }
    }, 1000 / 60);
  }
  /**
   * Animates the bottle rotation while flying
   */
  animateRotation() {
    this.rotationInterval = setInterval(() => {
      if (this.hasLanded) return;
      this.playAnimation(this.IMAGES_BOTTLE);
      if (this.y >= this.groundY) {
        this.onLand();
      }
    }, 1000 / 15);
  }

  /**
   * Handles bottle landing on ground
   */
  onLand() {
    if (this.hasLanded) return;
    this.hasLanded = true;
    this.y = this.groundY;
    if (this.moveInterval) clearInterval(this.moveInterval);
    if (this.rotationInterval) clearInterval(this.rotationInterval);
    this.playSplashOnce();
  }

  /**
   * Plays the splash animation once
   */
  playSplashOnce() {
    const images = this.IMAGES_BOTTLE_BROKEN;
    let i = 0;
    const frameMs = 1000 / 20;
    this.splashInterval = setInterval(() => {
      this.processSplashFrame(images, i);
      i++;
    }, frameMs);
  }

  /**
   * Processes a single splash animation frame
   * @param {Array} images - Array of splash images
   * @param {number} i - Current frame index
   */
  processSplashFrame(images, i) {
    if (i >= images.length) {
      this.endSplashAnimation();
      return;
    }
    const path = images[i];
    this.img = this.imageCache[path];
  }

  /**
   * Ends the splash animation and removes the bottle
   */
  endSplashAnimation() {
    clearInterval(this.splashInterval);
    this.removed = true;
    this.width = 0;
    this.height = 0;
  }

  /**
   * Draws the bottle with proper flipping
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  draw(ctx) {
    if (this.removed) return;
    
    this.handleImageFlip(ctx);
    super.draw(ctx);
    this.handleImageFlipBack(ctx);
  }

  /**
   * Handles image flipping if needed
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  handleImageFlip(ctx) {
    if (this.direction === -1) {
      this.flipImage(ctx);
    }
  }

  /**
   * Handles image flip restoration if needed
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  handleImageFlipBack(ctx) {
    if (this.direction === -1) {
      this.flipImageBack(ctx);
    }
  }

  /**
   * Flips the image horizontally
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  flipImage(ctx) {
    ctx.save();
    ctx.translate(this.width, 0);
    ctx.scale(-1, 1);
    this.x = this.x * -1;
  }

  /**
   * Restores the image flip
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  flipImageBack(ctx) {
    this.x = this.x * -1;
    ctx.restore();
  }

  /**
   * Checks if bottle is above ground
   * @returns {boolean} True if above ground
   */
  isAboveGround() {
    return this.y < this.groundY;
  }
}
