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
    this.x = 100; // Initial x position
    this.y = 100; // Initial y position
    this.width = 120; // Initial width
    this.height = 200; // Initial height
    this.speed = 6;
    this.offset = {
      left: 25,
      top: 70,
      bottom: 10,
      right: 20,
    };
    this.idleTime = 0; // ms ohne Eingabe, für Idle/Long-Idle
    this.lastIdleFrameAt = 0; // Zeitstempel der letzten Idle-Frameaktualisierung
    this.idleFrameInterval = 150; // Idle: langsamer abspielen (ms pro Frame)
    this.longIdleFrameInterval = 180; // Long-Idle noch etwas langsamer
    this.lastDeadFrameAt = 0; // Zeitstempel für Dead-Frames
    this.deadFrameInterval = 150; // Dead-Animation langsamer (ms pro Frame)
    this.deadSound = new Audio("assets/audio/dead.mp3");
    this.deadSoundPlayed = false;
    this.hurtSound = new Audio("assets/audio/hurt.mp3");
    this.jumpSound = new Audio("assets/audio/jump.mp3");
    this.walkSound = new Audio("assets/audio/walk.mp3");
    this.walkSound.loop = true;
    this.lastJumpFrameAt = 0; // Zeitstempel für Jump-Frames
    this.jumpFrameInterval = 50; // Jump-Animation verlangsamen (ms pro Frame)
    this.lastWalkFrameAt = 0; // Zeitstempel für Walk-Frames
    this.walkFrameInterval = 80; // Walk-Animation verlangsamen (ms pro Frame)
    this.animate();
    this.applyGravity();
  }

  animate() {
    setInterval(() => {
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
      this.world.camera_x = -this.x + 100;
    }, 1000 / 60);
    setInterval(() => {
      if (this.die()) {
        if (!this.deadSoundPlayed && this.deadSound) {
          try {
            this.deadSound.currentTime = 0;
            this.deadSound.play();
          } catch (e) {}
          this.deadSoundPlayed = true;
        }
        // sicherstellen, dass Hurt-Sound nicht weiterläuft
        if (this.hurtSound && !this.hurtSound.paused) {
          try { this.hurtSound.pause(); } catch (e) {}
          try { this.hurtSound.currentTime = 0; } catch (e) {}
        }
        // Walk-Sound stoppen
        if (this.walkSound && !this.walkSound.paused) {
          try { this.walkSound.pause(); } catch (e) {}
          try { this.walkSound.currentTime = 0; } catch (e) {}
        }
        // Walk-Frame-Timer zurücksetzen
        this.lastWalkFrameAt = 0;
        const now = (typeof performance !== "undefined" && performance.now) ? performance.now() : new Date().getTime();
        if (now - this.lastDeadFrameAt >= this.deadFrameInterval) {
          this.playAnimation(this.IMAGES_DEAD);
          this.lastDeadFrameAt = now;
        }
        return;
      }
      if (this.hurt()) {
        this.playAnimation(this.IMAGES_HURT);
        // Walk-Sound stoppen
        if (this.walkSound && !this.walkSound.paused) {
          try { this.walkSound.pause(); } catch (e) {}
          try { this.walkSound.currentTime = 0; } catch (e) {}
        }
        // Walk-Frame-Timer zurücksetzen
        this.lastWalkFrameAt = 0;
        return;
      }

      if (this.isAboveGround()) {
        const now = (typeof performance !== "undefined" && performance.now) ? performance.now() : new Date().getTime();
        if (now - this.lastJumpFrameAt >= this.jumpFrameInterval) {
          this.playAnimation(this.IMAGES_JUMP);
          this.lastJumpFrameAt = now;
        }
        this.idleTime = 0;
        this.lastIdleFrameAt = 0;
        this.lastWalkFrameAt = 0;
        // Walk-Sound stoppen
        if (this.walkSound && !this.walkSound.paused) {
          try { this.walkSound.pause(); } catch (e) {}
          try { this.walkSound.currentTime = 0; } catch (e) {}
        }
        return;
      }

      const isMoving = this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
      if (isMoving) {
        const now = (typeof performance !== "undefined" && performance.now) ? performance.now() : new Date().getTime();
        if (now - this.lastWalkFrameAt >= this.walkFrameInterval) {
          this.playAnimation(this.IMAGES_WALKING);
          this.lastWalkFrameAt = now;
        }
        this.idleTime = 0;
        this.lastIdleFrameAt = 0;
        this.lastJumpFrameAt = 0;
        // Walk-Sound starten
        try {
          if (this.walkSound && this.walkSound.paused) {
            this.walkSound.currentTime = 0;
            this.walkSound.play();
          }
        } catch (e) {}
      } else {
        this.idleTime += 50;
        const now = (typeof performance !== "undefined" && performance.now) ? performance.now() : new Date().getTime();
        const interval = this.idleTime > 5000 ? this.longIdleFrameInterval : this.idleFrameInterval;
        if (now - this.lastIdleFrameAt >= interval) {
          if (this.idleTime > 5000) {
            this.playAnimation(this.IMAGES_LONG_IDLE);
          } else {
            this.playAnimation(this.IMAGES_IDLE);
          }
          this.lastIdleFrameAt = now;
        }
        this.lastWalkFrameAt = 0;
        this.lastJumpFrameAt = 0;
        // Walk-Sound stoppen
        if (this.walkSound && !this.walkSound.paused) {
          try { this.walkSound.pause(); } catch (e) {}
          try { this.walkSound.currentTime = 0; } catch (e) {}
        }
      }
    }, 50);
  }

  hit() {
    // Wenn bereits tot: keine weiteren Hit-Effekte oder Sounds
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
    // Sprunganimation immer von vorne starten
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
}
