class Endboss extends MovableObject {
  IMAGES_WALKING = [
    "assets/img/4_enemie_boss_chicken/1_walk/G1.png",
    "assets/img/4_enemie_boss_chicken/1_walk/G2.png",
    "assets/img/4_enemie_boss_chicken/1_walk/G3.png",
    "assets/img/4_enemie_boss_chicken/1_walk/G4.png",
  ];
  IMAGES_ALERT = [
    "assets/img/4_enemie_boss_chicken/2_alert/G5.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G6.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G7.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G8.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G9.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G10.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G11.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G12.png",
  ];
  IMAGES_ATTACK = [
    "assets/img/4_enemie_boss_chicken/3_attack/G13.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G14.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G15.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G16.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G17.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G18.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G19.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G20.png",
  ];
  IMAGES_HURT = [
    "assets/img/4_enemie_boss_chicken/4_hurt/G21.png",
    "assets/img/4_enemie_boss_chicken/4_hurt/G22.png",
    "assets/img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];
  IMAGES_DEAD = [
    "assets/img/4_enemie_boss_chicken/5_dead/G24.png",
    "assets/img/4_enemie_boss_chicken/5_dead/G25.png",
    "assets/img/4_enemie_boss_chicken/5_dead/G26.png",
  ]

  isHurt = false;
  hurtEndAt = 0;
  isDead = false;
  lastHitTime = 0;
  hitCooldown = 1000;
  maxLives = 3;
  lives = 3;
  health = 100;
  state = 'walking';
  alertPlayed = false;
  alertEndTime = 0;
  attackEndTime = 0;
  originalSpeed;
  attackSpeed;
  deadAnimationPlayed = false;
  deadAnimationEndTime = 0;
  deadFrameCount = 0;
  lastDeadFrameAt = 0;
  soundManager = SoundManager.getInstance();
  hurtSound;
  thrownBottles = [];
  lastBottleThrow = 0;
  bottleThrowCooldown = 2000;

  /**
   * Creates a new Endboss instance with all necessary properties and animations
   */
  constructor() {
    super();
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.setupPosition();
    this.setupDimensions();
    this.setupSpeed();
    this.setupOffset();
    this.initializeSounds();
    this.animate();
  }

  /**
   * Sets up the endboss position
   */
  setupPosition() {
    this.x = 2500;
    this.y = 150;
  }

  /**
   * Sets up the endboss dimensions
   */
  setupDimensions() {
    this.width = 300;
    this.height = 300;
  }

  /**
   * Sets up the endboss speed properties
   */
  setupSpeed() {
    this.speed = 0.15 + Math.random() * 0.25;
    this.originalSpeed = this.speed;
    this.attackSpeed = this.speed * 20;
  }

  /**
   * Sets up the endboss offset
   */
  setupOffset() {
    this.offset = {
      left: 40,
      top: 20,
      bottom: 20,
      right: 20,
    };
  }

  /**
   * Initializes all endboss sounds
   */
  initializeSounds() {
    this.hurtSound = this.soundManager.createSound('assets/audio/endboss-hurt.mp3');
  }

  /**
   * Starts all endboss animations
   */
  animate() {
    this.startMovementAnimation();
    this.startAnimationLoop();
  }

  /**
   * Starts the movement animation loop
   */
  startMovementAnimation() {
    setInterval(() => {
      if (!this.isHurt && !this.isDead) {
        this.updateState();
        this.handleMovement();
      }
    }, 1000 / 60);
  }

  /**
   * Handles endboss movement based on current state
   */
  handleMovement() {
    if (this.state !== 'alert') {
      this.moveLeft();
    }
    if (this.state === 'attack') {
      this.tryThrowBottle();
    }
  }

  /**
   * Starts the animation loop
   */
  startAnimationLoop() {
    setInterval(() => {
      this.updateHurtState();
      this.playCurrentAnimation();
    }, 150);
  }

  /**
   * Updates the hurt state based on time
   */
  updateHurtState() {
    if (this.isHurt && (new Date().getTime() >= this.hurtEndAt)) {
      this.isHurt = false;
    }
  }

  /**
   * Updates the endboss state based on character distance
   */
  updateState() {
    if (!this.world || !this.world.character) return;
    
    const distance = this.calculateDistance();
    this.handleStateTransitions(distance);
  }

  /**
   * Calculates distance to character
   * @returns {number} Distance to character
   */
  calculateDistance() {
    return Math.abs(this.x - this.world.character.x);
  }

  /**
   * Handles state transitions based on distance and time
   * Manages walking -> alert -> attack -> walking state cycle
   * @param {number} distance - Distance to character in pixels
   */
  handleStateTransitions(distance) {
    const alertDistance = 500;
    const now = new Date().getTime();
    
    this.checkWalkingToAlert(distance, alertDistance, now);
    this.checkAlertToAttack(now);
    this.checkAttackToWalking(now);
  }

  /**
   * Checks if endboss should transition from walking to alert
   * @param {number} distance - Distance to character
   * @param {number} alertDistance - Alert trigger distance
   * @param {number} now - Current timestamp
   */
  checkWalkingToAlert(distance, alertDistance, now) {
    if (this.state === 'walking' && distance <= alertDistance) {
      this.transitionToAlert(now);
    }
  }

  /**
   * Checks if endboss should transition from alert to attack
   * @param {number} now - Current timestamp
   */
  checkAlertToAttack(now) {
    if (this.state === 'alert' && now >= this.alertEndTime) {
      this.transitionToAttack(now);
    }
  }

  /**
   * Checks if endboss should transition from attack to walking
   * @param {number} now - Current timestamp
   */
  checkAttackToWalking(now) {
    if (this.state === 'attack' && now >= this.attackEndTime) {
      this.transitionToWalking();
    }
  }

  /**
   * Transitions endboss to alert state
   * @param {number} now - Current timestamp
   */
  transitionToAlert(now) {
    this.state = 'alert';
    this.alertPlayed = false;
    this.alertEndTime = now + 2000;
  }

  /**
   * Transitions endboss to attack state
   * @param {number} now - Current timestamp
   */
  transitionToAttack(now) {
    this.state = 'attack';
    this.attackEndTime = now + 3000;
    this.speed = this.attackSpeed;
  }

  /**
   * Transitions endboss to walking state
   */
  transitionToWalking() {
    this.state = 'walking';
    this.speed = this.originalSpeed;
  }

  /**
   * Plays the current animation based on state
   */
  playCurrentAnimation() {
    if (this.isDead) {
      this.handleDeadAnimation();
    } else if (this.isHurt) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.state === 'alert') {
      this.playAnimation(this.IMAGES_ALERT);
    } else if (this.state === 'attack') {
      this.playAnimation(this.IMAGES_ATTACK);
    } else {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }

  /**
   * Handles the dead animation state
   */
  handleDeadAnimation() {
    this.initializeDeadAnimation();
    this.playDeadFrame();
  }

  /**
   * Initializes the dead animation
   */
  initializeDeadAnimation() {
    if (!this.deadAnimationPlayed) {
      this.deadAnimationPlayed = true;
      this.currentImage = 0;
      this.lastDeadFrameAt = 0;
      this.deadFrameCount = 0;
    }
  }

  /**
   * Plays a single dead animation frame
   */
  playDeadFrame() {
    const now = new Date().getTime();
    if (now - this.lastDeadFrameAt >= 300) {
      this.updateDeadFrame();
      this.lastDeadFrameAt = now;
      this.deadFrameCount++;
      this.checkDeadAnimationEnd();
    }
  }

  /**
   * Updates the dead animation frame
   */
  updateDeadFrame() {
    const frameIndex = this.deadFrameCount % this.IMAGES_DEAD.length;
    const path = this.IMAGES_DEAD[frameIndex];
    this.img = this.imageCache[path];
  }

  /**
   * Checks if dead animation should end
   */
  checkDeadAnimationEnd() {
    if (this.deadFrameCount > this.IMAGES_DEAD.length) {
      this.width = 0;
      this.height = 0;
    }
  }

  /**
   * Handles endboss taking a hit
   */
  takeHit() {
    if (this.isDead) return;
    if (!this.canTakeHit()) return;
    
    this.processHit();
    this.updateHealth();
    this.checkDeath();
  }

  /**
   * Checks if endboss can take a hit
   * @returns {boolean} True if can take hit
   */
  canTakeHit() {
    const now = new Date().getTime();
    return now - this.lastHitTime >= this.hitCooldown;
  }

  /**
   * Processes the hit effect
   */
  processHit() {
    const now = new Date().getTime();
    this.lastHitTime = now;
    this.isHurt = true;
    this.hurtEndAt = now + 1500;
    this.playHurtSound();
  }

  /**
   * Plays the hurt sound effect
   */
  playHurtSound() {
    this.soundManager.playSound(this.hurtSound);
  }

  /**
   * Updates endboss health after taking a hit
   * Decreases lives and converts to percentage for health bar display
   */
  updateHealth() {
    this.lives = Math.max(0, this.lives - 1);
    const livesToPercent = { 3: 100, 2: 60, 1: 20, 0: 0 };
    this.health = livesToPercent[this.lives];
    this.updateHealthBar();
  }

  /**
   * Updates the health bar display
   */
  updateHealthBar() {
    if (this.world && this.world.endbossBar) {
      this.world.endbossBar.setPercentage(this.health);
    }
  }

  /**
   * Checks if endboss should die
   */
  checkDeath() {
    if (this.lives === 0) {
      this.isDead = true;
      this.isHurt = false;
    }
  }

  /**
   * Tries to throw a bottle if cooldown allows
   */
  tryThrowBottle() {
    if (!this.world || !this.world.character) return;
    
    const now = new Date().getTime();
    if (now - this.lastBottleThrow >= this.bottleThrowCooldown) {
      this.throwBottle();
      this.lastBottleThrow = now;
    }
  }

  /**
   * Throws a bottle towards the character
   */
  throwBottle() {
    const direction = this.x > this.world.character.x ? -1 : 1;
    const bottle = new EndbossBottle(
      this.x + this.width / 2,
      this.y + this.height / 2,
      direction
    );
    this.thrownBottles.push(bottle);
  }

  /**
   * Gets all thrown bottles
   * @returns {Array} Array of thrown bottles
   */
  getThrownBottles() {
    return this.thrownBottles;
  }
}
