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

  constructor() {
    super();
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 2500;
    this.y = 150;
    this.width = 300;
    this.height = 300;
    this.speed = 0.15 + Math.random() * 0.25;
    this.isHurt = false;
    this.hurtEndAt = 0;
    this.isDead = false;
    this.lastHitTime = 0;
    this.hitCooldown = 1000;
    this.maxLives = 3;
    this.lives = 3;
    this.health = 100;
    this.state = 'walking';
    this.alertPlayed = false;
    this.alertEndTime = 0;
    this.attackEndTime = 0;
    this.originalSpeed = this.speed;
    this.attackSpeed = this.speed * 20;
    this.deadAnimationPlayed = false;
    this.deadAnimationEndTime = 0;
    this.deadFrameCount = 0;
    this.soundManager = SoundManager.getInstance();
    this.hurtSound = this.soundManager.createSound('assets/audio/endboss-hurt.mp3');
    this.thrownBottles = [];
    this.lastBottleThrow = 0;
    this.bottleThrowCooldown = 2000;
    this.offset = {
      left: 40,
      top: 20,
      bottom: 20,
      right: 20,
    };
    this.animate();
  }

  animate() {
    this.startMovementAnimation();
    this.startAnimationLoop();
  }

  startMovementAnimation() {
    setInterval(() => {
      if (!this.isHurt && !this.isDead) {
        this.updateState();
        this.handleMovement();
      }
    }, 1000 / 60);
  }

  handleMovement() {
    if (this.state !== 'alert') {
      this.moveLeft();
    }
    if (this.state === 'attack') {
      this.tryThrowBottle();
    }
  }

  startAnimationLoop() {
    setInterval(() => {
      this.updateHurtState();
      this.playCurrentAnimation();
    }, 150);
  }

  updateHurtState() {
    if (this.isHurt && (new Date().getTime() >= this.hurtEndAt)) {
      this.isHurt = false;
    }
  }

  updateState() {
    if (!this.world || !this.world.character) return;
    
    const distance = this.calculateDistance();
    this.handleStateTransitions(distance);
  }

  calculateDistance() {
    return Math.abs(this.x - this.world.character.x);
  }

  handleStateTransitions(distance) {
    const alertDistance = 500;
    const now = new Date().getTime();
    
    if (this.state === 'walking' && distance <= alertDistance) {
      this.transitionToAlert(now);
    } else if (this.state === 'alert' && now >= this.alertEndTime) {
      this.transitionToAttack(now);
    } else if (this.state === 'attack' && now >= this.attackEndTime) {
      this.transitionToWalking();
    }
  }

  transitionToAlert(now) {
    this.state = 'alert';
    this.alertPlayed = false;
    this.alertEndTime = now + 2000;
  }

  transitionToAttack(now) {
    this.state = 'attack';
    this.attackEndTime = now + 3000;
    this.speed = this.attackSpeed;
  }

  transitionToWalking() {
    this.state = 'walking';
    this.speed = this.originalSpeed;
  }

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

  handleDeadAnimation() {
    this.initializeDeadAnimation();
    this.playDeadFrame();
  }

  initializeDeadAnimation() {
    if (!this.deadAnimationPlayed) {
      this.deadAnimationPlayed = true;
      this.currentImage = 0;
      this.lastDeadFrameAt = 0;
      this.deadFrameCount = 0;
    }
  }

  playDeadFrame() {
    const now = new Date().getTime();
    if (now - this.lastDeadFrameAt >= 300) {
      this.updateDeadFrame();
      this.lastDeadFrameAt = now;
      this.deadFrameCount++;
      this.checkDeadAnimationEnd();
    }
  }

  updateDeadFrame() {
    const frameIndex = this.deadFrameCount % this.IMAGES_DEAD.length;
    const path = this.IMAGES_DEAD[frameIndex];
    this.img = this.imageCache[path];
  }

  checkDeadAnimationEnd() {
    if (this.deadFrameCount > this.IMAGES_DEAD.length) {
      this.width = 0;
      this.height = 0;
    }
  }

  takeHit() {
    if (this.isDead) return;
    if (!this.canTakeHit()) return;
    
    this.processHit();
    this.updateHealth();
    this.checkDeath();
  }

  canTakeHit() {
    const now = new Date().getTime();
    return now - this.lastHitTime >= this.hitCooldown;
  }

  processHit() {
    const now = new Date().getTime();
    this.lastHitTime = now;
    this.isHurt = true;
    this.hurtEndAt = now + 1500;
    this.playHurtSound();
  }

  playHurtSound() {
    this.soundManager.playSound(this.hurtSound);
  }

  updateHealth() {
    this.lives = Math.max(0, this.lives - 1);
    const livesToPercent = { 3: 100, 2: 60, 1: 20, 0: 0 };
    this.health = livesToPercent[this.lives];
    this.updateHealthBar();
  }

  updateHealthBar() {
    if (this.world && this.world.endbossBar) {
      this.world.endbossBar.setPercentage(this.health);
    }
  }

  checkDeath() {
    if (this.lives === 0) {
      this.isDead = true;
      this.isHurt = false;
    }
  }

  tryThrowBottle() {
    if (!this.world || !this.world.character) return;
    
    const now = new Date().getTime();
    if (now - this.lastBottleThrow >= this.bottleThrowCooldown) {
      this.throwBottle();
      this.lastBottleThrow = now;
    }
  }

  throwBottle() {
    const direction = this.x > this.world.character.x ? -1 : 1;
    const bottle = new EndbossBottle(
      this.x + this.width / 2,
      this.y + this.height / 2,
      direction
    );
    this.thrownBottles.push(bottle);
  }

  getThrownBottles() {
    return this.thrownBottles;
  }
}
