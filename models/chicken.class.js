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
  IMAGES_DEAD2 = ["assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  type;
  xMin;
  xMax;
  IMAGES_WALKING;
  isDead = false;
  animationInterval;
  soundManager = SoundManager.getInstance();
  deadSound;

  /**
   * Creates a new Chicken instance
   * @param {number} xMin - Minimum x position
   * @param {number} xMax - Maximum x position
   * @param {number} type - Chicken type (1 = normal, 2 = small)
   */
  constructor(xMin = 200, xMax = 700, type = 1) {
    super();
    this.type = type;
    this.xMin = xMin;
    this.xMax = xMax;
    this.IMAGES_WALKING =
      type === 2 ? this.IMAGES_WALKING_2 : this.IMAGES_WALKING_1;
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.setupPosition(xMin, xMax, type);
    this.setupDimensions(type);
    this.speed = 0.5 + Math.random() * 0.75;
    this.offset = {
      left: 5,
      top: 5,
      bottom: 5,
      right: 5,
    };
    this.initializeSounds();
    this.animate();
  }

  /**
   * Sets up the chicken position based on type
   * @param {number} xMin - Minimum x position
   * @param {number} xMax - Maximum x position
   * @param {number} type - Chicken type
   */
  setupPosition(xMin, xMax, type) {
    this.x = Math.random() * (xMax - xMin) + xMin;
    this.y = 370;
    if (type === 2) {
      this.y = 370;
    }
  }

  /**
   * Sets up the chicken dimensions based on type
   * @param {number} type - Chicken type
   */
  setupDimensions(type) {
    this.width = 60;
    this.height = 60;
  }

  /**
   * Initializes all chicken sounds
   */
  initializeSounds() {
    this.deadSound = this.soundManager.createSound("assets/audio/chicken.mp3");
  }

  /**
   * Animates the chicken by moving and playing walking animation
   */
  animate() {
    this.animationInterval = setInterval(() => {
      if (!this.isDead) {
        this.moveLeft();
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 100);
  }

  /**
   * Plays death animation and sound for the chicken
   */
  playDead() {
    if (this.isDead) return;
    this.isDead = true;
    this.speed = 0;
    this.setupDeadAnimation();
    this.startDeadAnimation();
    this.soundManager.playSound(this.deadSound);
  }

  /**
   * Sets up the death animation by loading dead images
   */
  setupDeadAnimation() {
    const deadImages = this.type === 2 ? this.IMAGES_DEAD2 : this.IMAGES_DEAD1;
    this.loadImages(deadImages);
    this.currentImage = 0;
    this.img = this.imageCache[deadImages[0]];
  }

  /**
   * Starts the death animation sequence
   */
  startDeadAnimation() {
    const deadImages = this.type === 2 ? this.IMAGES_DEAD2 : this.IMAGES_DEAD1;
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
    this.scheduleDeadCleanup(deadAnimation);
  }

  /**
   * Schedules cleanup after death animation completes
   * @param {number} deadAnimation - Animation interval ID
   */
  scheduleDeadCleanup(deadAnimation) {
    setTimeout(() => {
      this.width = 0;
      this.height = 0;
      clearInterval(deadAnimation);
    }, 1000);
  }

  /**
   * Resets the chicken position to a random location
   */
  resetPosition() {
    this.x = Math.random() * (this.xMax - this.xMin) + this.xMin;
    this.y = 370;
    if (this.type === 2) {
      this.y = 370 + (60 - this.height);
    }
  }
}
