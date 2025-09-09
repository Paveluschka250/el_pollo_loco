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
    this.x = 500;
    this.y = 150;
    this.width = 300; // Initial width
    this.height = 300; // Initial height
    this.speed = 0.15 + Math.random() * 0.25;
    this.isHurt = false;
    this.hurtEndAt = 0;
    this.isDead = false;
    this.lastHitTime = 0;
    this.hitCooldown = 1000; // 1 Sekunde zwischen Treffern
    this.maxLives = 3;
    this.lives = 3;
    this.health = 100; // spiegelt den Statusbar-Prozentsatz
    this.offset = {
      left: 20,
      top: 20,
      bottom: 20,
      right: 20,
    };
    this.animate();
  }

  animate() {
    // Bewegung unabhängig und flüssig halten
    setInterval(() => {
      if (!this.isHurt && !this.isDead) {
        this.moveLeft();
      }
    }, 1000 / 60);

    // Animation etwas langsamer abspielen
    setInterval(() => {
      // Hurt-Status beenden, wenn Zeit vorbei
      if (this.isHurt && (new Date().getTime() >= this.hurtEndAt)) {
        this.isHurt = false;
      }
      if (this.isDead) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isHurt) {
        this.playAnimation(this.IMAGES_HURT);
      } else {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 150);
  }

  takeHit() {
    if (this.isDead) return;
    // Cooling-Zeit prüfen
    const now = new Date().getTime();
    if (now - this.lastHitTime < this.hitCooldown) {
      return;
    }
    this.lastHitTime = now;
    this.isHurt = true;
    this.hurtEndAt = new Date().getTime() + 1000; // 1 Sekunde
    // Leben reduzieren (3 -> 2 -> 1 -> 0)
    this.lives = Math.max(0, this.lives - 1);
    // Prozentwerte grob auf 100/60/20/0 mappen
    const livesToPercent = { 3: 100, 2: 60, 1: 20, 0: 0 };
    this.health = livesToPercent[this.lives];
    if (this.world && this.world.endbossBar) {
      this.world.endbossBar.setPercentage(this.health);
    }
    // Beim letzten Treffer in Dead-Zustand wechseln
    if (this.lives === 0) {
      this.isDead = true;
      this.isHurt = false;
    }
  }
}
