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
    this.attackSpeed = this.speed * 10;
    this.deadAnimationPlayed = false;
    this.deadAnimationEndTime = 0;
    this.deadFrameCount = 0;
    this.hurtSound = new Audio('assets/audio/endboss-hurt.mp3');
    this.offset = {
      left: 20,
      top: 20,
      bottom: 20,
      right: 20,
    };
    this.animate();
  }

  animate() {
    setInterval(() => {
      if (!this.isHurt && !this.isDead) {
        this.updateState();
        if (this.state !== 'alert') {
          this.moveLeft();
        }
      }
    }, 1000 / 60);

    setInterval(() => {
      if (this.isHurt && (new Date().getTime() >= this.hurtEndAt)) {
        this.isHurt = false;
      }
      this.playCurrentAnimation();
    }, 150);
  }

  updateState() {
    if (!this.world || !this.world.character) return;
    
    const distance = Math.abs(this.x - this.world.character.x);
    const alertDistance = 400;
    const attackDistance = 300;
    
    const now = new Date().getTime();
    
    if (this.state === 'walking' && distance <= alertDistance) {
      this.state = 'alert';
      this.alertPlayed = false;
      this.alertEndTime = now + 2000;
    } else if (this.state === 'alert' && now >= this.alertEndTime) {
      this.state = 'attack';
      this.attackEndTime = now + 3000;
      this.speed = this.attackSpeed;
    } else if (this.state === 'attack' && now >= this.attackEndTime) {
      this.state = 'walking';
      this.speed = this.originalSpeed;
    }
  }

  playCurrentAnimation() {
    if (this.isDead) {
      if (!this.deadAnimationPlayed) {
        this.deadAnimationPlayed = true;
        this.currentImage = 0;
        this.lastDeadFrameAt = 0;
        this.deadFrameCount = 0;
      }
      
      const now = new Date().getTime();
      if (now - this.lastDeadFrameAt >= 300) {
        const frameIndex = this.deadFrameCount % this.IMAGES_DEAD.length;
        const path = this.IMAGES_DEAD[frameIndex];
        this.img = this.imageCache[path];
        this.lastDeadFrameAt = now;
        this.deadFrameCount++;
        
        if (this.deadFrameCount > this.IMAGES_DEAD.length) {
          this.width = 0;
          this.height = 0;
          return;
        }
      }
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

  takeHit() {
    if (this.isDead) return;
    const now = new Date().getTime();
    if (now - this.lastHitTime < this.hitCooldown) {
      return;
    }
    this.lastHitTime = now;
    this.isHurt = true;
    this.hurtEndAt = new Date().getTime() + 1000;
    
    this.hurtSound.currentTime = 0;
    this.hurtSound.play().catch(e => {
      console.log('Endboss hurt sound konnte nicht abgespielt werden:', e);
    });
    
    this.lives = Math.max(0, this.lives - 1);
    const livesToPercent = { 3: 100, 2: 60, 1: 20, 0: 0 };
    this.health = livesToPercent[this.lives];
    if (this.world && this.world.endbossBar) {
      this.world.endbossBar.setPercentage(this.health);
    }
    if (this.lives === 0) {
      this.isDead = true;
      this.isHurt = false;
    }
  }
}
