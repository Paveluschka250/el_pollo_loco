class Character extends MovableObject {
  IMAGES_WALKING = [
    "assets/img/2_character_pepe/2_walk/W-21.png",
    "assets/img/2_character_pepe/2_walk/W-22.png",
    "assets/img/2_character_pepe/2_walk/W-23.png",
    "assets/img/2_character_pepe/2_walk/W-24.png",
    "assets/img/2_character_pepe/2_walk/W-25.png",
    "assets/img/2_character_pepe/2_walk/W-26.png",
  ];
  IMAGES_JUMP = [
    "assets/img/2_character_pepe/3_jump/J-33.png",
    "assets/img/2_character_pepe/3_jump/J-34.png",
    "assets/img/2_character_pepe/3_jump/J-35.png",
    "assets/img/2_character_pepe/3_jump/J-36.png",
    "assets/img/2_character_pepe/3_jump/J-37.png",
    "assets/img/2_character_pepe/3_jump/J-38.png",
    "assets/img/2_character_pepe/3_jump/J-39.png",
  ];
  IMAGES_DEAD = [
    "assets/img/2_character_pepe/5_dead/D-51.png",
    "assets/img/2_character_pepe/5_dead/D-52.png",
    "assets/img/2_character_pepe/5_dead/D-53.png",
    "assets/img/2_character_pepe/5_dead/D-54.png",
    "assets/img/2_character_pepe/5_dead/D-55.png",
    "assets/img/2_character_pepe/5_dead/D-56.png",
    "assets/img/2_character_pepe/5_dead/D-57.png",
  ];
  IMAGES_HURT = [
    "assets/img/2_character_pepe/4_hurt/H-41.png",
    "assets/img/2_character_pepe/4_hurt/H-42.png",
    "assets/img/2_character_pepe/4_hurt/H-43.png",
  ];

  IMAGES_IDLE = [
    "assets/img/2_character_pepe/1_idle/idle/I-1.png",
    "assets/img/2_character_pepe/1_idle/idle/I-2.png",
    "assets/img/2_character_pepe/1_idle/idle/I-3.png",
    "assets/img/2_character_pepe/1_idle/idle/I-4.png",
    "assets/img/2_character_pepe/1_idle/idle/I-5.png",
    "assets/img/2_character_pepe/1_idle/idle/I-6.png",
    "assets/img/2_character_pepe/1_idle/idle/I-7.png",
    "assets/img/2_character_pepe/1_idle/idle/I-8.png",
    "assets/img/2_character_pepe/1_idle/idle/I-9.png",
    "assets/img/2_character_pepe/1_idle/idle/I-10.png",
  ];
  IMAGES_LONG_IDLE = [
    "assets/img/2_character_pepe/1_idle/long_idle/I-11.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-12.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-13.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-14.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-15.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-16.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-17.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-18.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-19.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];
  world;
  idleTime = 0;
  lastIdleFrameAt = 0;
  idleFrameInterval = 150;
  longIdleFrameInterval = 180;
  lastDeadFrameAt = 0;
  deadFrameInterval = 150;
  lastJumpFrameAt = 0;
  jumpFrameInterval = 50;
  lastWalkFrameAt = 0;
  walkFrameInterval = 80;
  movementInterval = null;
  animationInterval = null;
  soundManager = SoundManager.getInstance();
  deadSound;
  deadSoundPlayed = false;
  hurtSound;
  jumpSound;
  walkSound;

  /**
   * Creates a new Character instance with all necessary properties and animations
   */
  constructor() {
    super();
    this.loadImage("assets/img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMP);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.x = 100;
    this.y = 100;
    this.width = 120;
    this.height = 200;
    this.speed = 6;
    this.offset = {
      left: 25,
      top: 70,
      bottom: 10,
      right: 20,
    };
    this.initializeSounds();
    this.animate();
    this.applyGravity();
  }

  /**
   * Initializes all character sounds
   */
  initializeSounds() {
    this.deadSound = this.soundManager.createSound("assets/audio/dead.mp3");
    this.hurtSound = this.soundManager.createSound("assets/audio/hurt.mp3");
    this.jumpSound = this.soundManager.createSound("assets/audio/jump.mp3");
    this.walkSound = this.soundManager.createSound("assets/audio/walk.mp3", { loop: true });
  }

  /**
   * Starts all character animations
   */
  animate() {
    this.startMovementAnimation();
    this.startCharacterAnimation();
  }

  /**
   * Starts the movement animation loop
   */
  startMovementAnimation() {
    this.movementInterval = setInterval(() => {
      if (this.world.endscreen && this.world.endscreen.visible) {
        return;
      }
      this.handleMovement();
      this.world.camera_x = -this.x + 100;
    }, 1000 / 60);
  }

  /**
   * Handles character movement based on keyboard input
   */
  handleMovement() {
    if (this.world.keyboard.RIGHT && this.x < 2200) {
      this.moveRight();
      this.otherDirection = false;
    }
    if (this.world.keyboard.LEFT && this.x > -600) {
      this.moveLeft();
      this.otherDirection = true;
    }
    if (this.world.keyboard.UP && !this.isAboveGround()) {
      this.jump();
    }
  }

  /**
   * Starts the character animation loop
   */
  startCharacterAnimation() {
    this.animationInterval = setInterval(() => {
      this.processAnimationFrame();
    }, 50);
  }

  /**
   * Processes a single animation frame based on character state
   * Determines which animation to play based on character condition (dead, hurt, jumping, walking/idle)
   */
  processAnimationFrame() {
    if (this.die()) {this.handleDeadAnimation();return;}
    if (this.world.endscreen && this.world.endscreen.visible) {return;}
    if (this.hurt()) {this.handleHurtAnimation();return;}
    if (this.isAboveGround()) {this.handleJumpAnimation();return;}
    this.handleWalkOrIdleAnimation();
  }

  /**
   * Handles the dead animation state
   */
  handleDeadAnimation() {
    this.playDeadSound();
    this.stopAllSounds();
    this.lastWalkFrameAt = 0;
    this.playDeadFrame();
  }

  /**
   * Plays the dead sound effect once
   */
  playDeadSound() {
    if (!this.deadSoundPlayed && this.deadSound) {
      this.soundManager.playSound(this.deadSound);
      this.deadSoundPlayed = true;
    }
  }

  /**
   * Stops all character sounds
   */
  stopAllSounds() {
    this.soundManager.stopSound(this.hurtSound);
    this.soundManager.stopSound(this.walkSound);
  }

  /**
   * Plays the dead animation frame
   */
  playDeadFrame() {
    const now = (typeof performance !== "undefined" && performance.now) ? performance.now() : new Date().getTime();
    if (now - this.lastDeadFrameAt >= this.deadFrameInterval) {
      this.playAnimation(this.IMAGES_DEAD);
      this.lastDeadFrameAt = now;
    }
  }

  /**
   * Handles the hurt animation state
   */
  handleHurtAnimation() {
    this.playAnimation(this.IMAGES_HURT);
    if (this.walkSound && !this.walkSound.paused) {
      try { this.walkSound.pause(); } catch (e) {}
      try { this.walkSound.currentTime = 0; } catch (e) {}
    }
    this.lastWalkFrameAt = 0;
  }

  /**
   * Handles the jump animation state
   */
  handleJumpAnimation() {
    this.updateJumpFrame();
    this.resetAnimationTimers();
    this.stopWalkSound();
  }

  /**
   * Updates the jump animation frame
   */
  updateJumpFrame() {
    const now = (typeof performance !== "undefined" && performance.now) ? performance.now() : new Date().getTime();
    if (now - this.lastJumpFrameAt >= this.jumpFrameInterval) {
      this.playAnimation(this.IMAGES_JUMP);
      this.lastJumpFrameAt = now;
    }
  }

  /**
   * Resets all animation timers
   */
  resetAnimationTimers() {
    this.idleTime = 0;
    this.lastIdleFrameAt = 0;
    this.lastWalkFrameAt = 0;
  }

  /**
   * Stops the walk sound effect
   */
  stopWalkSound() {
    if (this.walkSound && !this.walkSound.paused) {
      try { this.walkSound.pause(); } catch (e) {}
      try { this.walkSound.currentTime = 0; } catch (e) {}
    }
  }

  /**
   * Handles walk or idle animation based on movement
   */
  handleWalkOrIdleAnimation() {
    const isMoving = this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
    if (isMoving) {
      this.handleWalkAnimation();
    } else {
      this.handleIdleAnimation();
    }
  }

  /**
   * Handles the walk animation state
   */
  handleWalkAnimation() {
    const now = (typeof performance !== "undefined" && performance.now) ? performance.now() : new Date().getTime();
    if (now - this.lastWalkFrameAt >= this.walkFrameInterval) {
      this.playAnimation(this.IMAGES_WALKING);
      this.lastWalkFrameAt = now;
    }
    this.idleTime = 0;
    this.lastIdleFrameAt = 0;
    this.lastJumpFrameAt = 0;
    this.startWalkSound();
  }

  /**
   * Starts the walk sound effect
   */
  startWalkSound() {
    if (this.walkSound && this.walkSound.paused) {
      this.soundManager.playSound(this.walkSound, { resetTime: false });
    } else if (this.walkSound && !this.walkSound.paused) {
      this.walkSound.volume = this.soundManager.soundEnabled ? (this.walkSound.originalVolume || 1) : 0;
    }
  }

  /**
   * Handles the idle animation state with timing-based frame updates
   * Switches between normal idle and long idle animation after 5 seconds of inactivity
   */
  handleIdleAnimation() {
    this.idleTime += 50;
    const now = (typeof performance !== "undefined" && performance.now) ? performance.now() : new Date().getTime();
    const interval = this.idleTime > 5000 ? this.longIdleFrameInterval : this.idleFrameInterval;
    if (now - this.lastIdleFrameAt >= interval) {
      this.playIdleAnimation();
      this.lastIdleFrameAt = now;
    }
    this.lastWalkFrameAt = 0;
    this.lastJumpFrameAt = 0;
    this.stopWalkSound();
  }

  /**
   * Plays the appropriate idle animation based on idle time
   */
  playIdleAnimation() {
    if (this.idleTime > 5000) {
      this.playAnimation(this.IMAGES_LONG_IDLE);
    } else {
      this.playAnimation(this.IMAGES_IDLE);
    }
  }

  stopWalkSound() {
    this.soundManager.stopSound(this.walkSound);
  }

  /**
   * Handles character hit with sound effect
   */
  hit() {
    if (this.die()) {
      return;
    }
    super.hit();
    try {
      this.soundManager.playSound(this.hurtSound);
    } catch (e) {}
  }

  /**
   * Handles character jump with sound effect
   */
  jump() {
    if (this.die()) {
      return;
    }
    this.currentImage = 0;
    this.lastJumpFrameAt = 0;
    super.jump();
    try {
      this.soundManager.playSound(this.jumpSound);
    } catch (e) {}
  }

  /**
   * Stops all character animation intervals
   */
  stopAllIntervals() {
    if (this.movementInterval) {
      clearInterval(this.movementInterval);
      this.movementInterval = null;
    }
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
  }
}
