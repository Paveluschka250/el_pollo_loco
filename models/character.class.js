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
    this.idleTime = 0;
    this.lastIdleFrameAt = 0;
    this.idleFrameInterval = 150;
    this.longIdleFrameInterval = 180;
    this.lastDeadFrameAt = 0;
    this.deadFrameInterval = 150;
    this.deadSound = new Audio("assets/audio/dead.mp3");
    this.deadSoundPlayed = false;
    this.hurtSound = new Audio("assets/audio/hurt.mp3");
    this.jumpSound = new Audio("assets/audio/jump.mp3");
    this.walkSound = new Audio("assets/audio/walk.mp3");
    this.walkSound.loop = true;
    this.lastJumpFrameAt = 0;
    this.jumpFrameInterval = 50;
    this.lastWalkFrameAt = 0;
    this.walkFrameInterval = 80;
    this.movementInterval = null;
    this.animationInterval = null;
    this.animate();
    this.applyGravity();
  }

  animate() {
    this.startMovementAnimation();
    this.startCharacterAnimation();
  }

  startMovementAnimation() {
    this.movementInterval = setInterval(() => {
      if (this.world.endscreen && this.world.endscreen.visible) {
        return;
      }
      this.handleMovement();
      this.world.camera_x = -this.x + 100;
    }, 1000 / 60);
  }

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

  startCharacterAnimation() {
    this.animationInterval = setInterval(() => {
      if (this.die()) {
        this.handleDeadAnimation();
        return;
      }
      if (this.world.endscreen && this.world.endscreen.visible) {
        return;
      }
      if (this.hurt()) {
        this.handleHurtAnimation();
        return;
      }
      if (this.isAboveGround()) {
        this.handleJumpAnimation();
        return;
      }
      this.handleWalkOrIdleAnimation();
    }, 50);
  }

  handleDeadAnimation() {
    this.playDeadSound();
    this.stopAllSounds();
    this.lastWalkFrameAt = 0;
    this.playDeadFrame();
  }

  playDeadSound() {
    if (!this.deadSoundPlayed && this.deadSound) {
      try {
        this.deadSound.currentTime = 0;
        this.deadSound.play();
      } catch (e) {}
      this.deadSoundPlayed = true;
    }
  }

  stopAllSounds() {
    if (this.hurtSound && !this.hurtSound.paused) {
      try { this.hurtSound.pause(); } catch (e) {}
      try { this.hurtSound.currentTime = 0; } catch (e) {}
    }
    if (this.walkSound && !this.walkSound.paused) {
      try { this.walkSound.pause(); } catch (e) {}
      try { this.walkSound.currentTime = 0; } catch (e) {}
    }
  }

  playDeadFrame() {
    const now = (typeof performance !== "undefined" && performance.now) ? performance.now() : new Date().getTime();
    if (now - this.lastDeadFrameAt >= this.deadFrameInterval) {
      this.playAnimation(this.IMAGES_DEAD);
      this.lastDeadFrameAt = now;
    }
  }

  handleHurtAnimation() {
    this.playAnimation(this.IMAGES_HURT);
    if (this.walkSound && !this.walkSound.paused) {
      try { this.walkSound.pause(); } catch (e) {}
      try { this.walkSound.currentTime = 0; } catch (e) {}
    }
    this.lastWalkFrameAt = 0;
  }

  handleJumpAnimation() {
    const now = (typeof performance !== "undefined" && performance.now) ? performance.now() : new Date().getTime();
    if (now - this.lastJumpFrameAt >= this.jumpFrameInterval) {
      this.playAnimation(this.IMAGES_JUMP);
      this.lastJumpFrameAt = now;
    }
    this.idleTime = 0;
    this.lastIdleFrameAt = 0;
    this.lastWalkFrameAt = 0;
    if (this.walkSound && !this.walkSound.paused) {
      try { this.walkSound.pause(); } catch (e) {}
      try { this.walkSound.currentTime = 0; } catch (e) {}
    }
  }

  handleWalkOrIdleAnimation() {
    const isMoving = this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
    if (isMoving) {
      this.handleWalkAnimation();
    } else {
      this.handleIdleAnimation();
    }
  }

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

  startWalkSound() {
    try {
      if (this.walkSound && this.walkSound.paused) {
        this.walkSound.currentTime = 0;
        this.walkSound.play();
      }
    } catch (e) {}
  }

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

  playIdleAnimation() {
    if (this.idleTime > 5000) {
      this.playAnimation(this.IMAGES_LONG_IDLE);
    } else {
      this.playAnimation(this.IMAGES_IDLE);
    }
  }

  stopWalkSound() {
    if (this.walkSound && !this.walkSound.paused) {
      try { this.walkSound.pause(); } catch (e) {}
      try { this.walkSound.currentTime = 0; } catch (e) {}
    }
  }

  hit() {
    if (this.die()) {
      return;
    }
    super.hit();
    try {
      if (this.hurtSound) {
        this.hurtSound.currentTime = 0;
        this.hurtSound.play();
      }
    } catch (e) {}
  }

  jump() {
    if (this.die()) {
      return;
    }
    this.currentImage = 0;
    this.lastJumpFrameAt = 0;
    super.jump();
    try {
      if (this.jumpSound) {
        this.jumpSound.currentTime = 0;
        this.jumpSound.play();
      }
    } catch (e) {}
  }

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
