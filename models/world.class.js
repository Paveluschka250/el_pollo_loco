class World {
  canvas;
  ctx;
  keyboard;
  camera_x;
  character = new Character();
  level = level;
  spaceWasDown = false;
  statusbar = [
    Object.assign(new Statusbar("health"), { y: -10 }),
    Object.assign(new Statusbar("coins"), { y: 30 }),
    Object.assign(new Statusbar("bottle"), { y: 70 }),
  ];
  endbossBar = new Statusbar("endboss");
  endscreen = new Endscreen();
  throwableObjects = [];
  backgroundMusic = new Audio("assets/audio/background-music.mp3");
  gameRunning = false;
  gameIntervals = [];

  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.camera_x = 0;
    this.setupBackgroundMusic();
    this.draw();
    this.setWorld();
    this.run();
    this.setupEventListeners();
    this.setupKeyboardEvents();
  }

  setupBackgroundMusic() {
    // Hintergrundmusik konfigurieren
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.3; // Leiser als Soundeffekte
    this.backgroundMusic.preload = 'auto';
    
    // Musik starten (mit User-Interaktion)
    this.startBackgroundMusic();
  }

  startBackgroundMusic() {
    // Musik nur starten, wenn der Browser es erlaubt (User-Interaktion erforderlich)
    const playMusic = () => {
      this.backgroundMusic.play().catch(e => {
        console.log('Musik konnte nicht automatisch gestartet werden:', e);
      });
    };
    
    // Sofort versuchen zu starten
    playMusic();
    
    // Falls das nicht funktioniert, bei erstem Klick starten
    const startOnClick = () => {
      playMusic();
      document.removeEventListener('click', startOnClick);
      document.removeEventListener('keydown', startOnClick);
    };
    
    document.addEventListener('click', startOnClick);
    document.addEventListener('keydown', startOnClick);
  }

  startGame() {
    this.gameRunning = true;
    this.startBackgroundMusic();
  }

  setupEventListeners() {
    this.canvas.addEventListener('click', (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      this.endscreen.handleClick(mouseX, mouseY);
    });
  }

  setupKeyboardEvents() {
    // Entferne alte Event-Listener falls vorhanden
    if (this.keyboardHandler) {
      window.removeEventListener("keydown", this.keyboardHandler);
      window.removeEventListener("keyup", this.keyboardHandler);
    }
    
    // Erstelle neue Event-Handler
    this.keyboardHandler = (e) => {
      if (e.key === "ArrowRight") {
        this.keyboard.RIGHT = true;
      }
      if (e.key === "ArrowLeft") {
        this.keyboard.LEFT = true;
      }
      if (e.key === "ArrowUp") {
        this.keyboard.UP = true;
      }
      if (e.key === "ArrowDown") {
        this.keyboard.DOWN = true;
      }
      if (e.key === " ") {
        this.keyboard.SPACE = true;
      }
    };

    this.keyboardUpHandler = (e) => {
      if (e.key === "ArrowRight") {
        this.keyboard.RIGHT = false;
      }
      if (e.key === "ArrowLeft") {
        this.keyboard.LEFT = false;
      }
      if (e.key === "ArrowUp") {
        this.keyboard.UP = false;
      }
      if (e.key === "ArrowDown") {
        this.keyboard.DOWN = false;
      }
      if (e.key === " ") {
        this.keyboard.SPACE = false;
      }
    };

    // Füge neue Event-Listener hinzu
    window.addEventListener("keydown", this.keyboardHandler);
    window.addEventListener("keyup", this.keyboardUpHandler);
  }

  setWorld() {
    this.character.world = this;
    // Endboss-Bar in die Welt einhängen
    const boss = this.level.chickens.find((e) => e instanceof Endboss);
    if (boss) {
      boss.world = this;
    }
  }

  run() {
    const gameLoop = setInterval(() => {
      if (this.gameRunning) {
        this.checkCollisions();
        this.checkCollisionsCoins();
        this.checkCollisionsBottles();
        this.checkThrowableObjects();
        this.checkBottleHitsChickens();
        this.checkGameEnd();
      }
    }, 16);
    this.gameIntervals.push(gameLoop);
  }

  pauseGame() {
    this.gameRunning = false;
    // Pausiere Hintergrundmusik
    this.backgroundMusic.pause();
  }

  resumeGame() {
    this.gameRunning = true;
    // Setze Hintergrundmusik fort
    this.backgroundMusic.play().catch(e => {
      console.log('Musik konnte nicht fortgesetzt werden:', e);
    });
  }

  checkGameEnd() {
    // Game Over: Character tot
    if (this.character.die() && !this.endscreen.visible) {
      this.endscreen.showLose();
    }
    
    // Win: Endboss tot und verschwunden
    const boss = this.level.chickens.find((e) => e instanceof Endboss);
    if (boss && boss.isDead && boss.width === 0 && !this.endscreen.visible) {
      this.endscreen.showWin();
    }
  }

  checkThrowableObjects() {
    if (this.keyboard.SPACE && !this.spaceWasDown) {
      const bottleBar = this.statusbar[2];
      const available = bottleBar?.percentage || 0;
      if (available >= 20) {
        let bottle = new ThrowableObject(
          this.character.x + 30,
          this.character.y + 100
        );
        this.throwableObjects.push(bottle);
        bottleBar.setPercentage(Math.max(0, available - 20));
        this.spaceWasDown = true;
      }
    }
    if (!this.keyboard.SPACE) {
      this.spaceWasDown = false;
    }
  }

  checkCollisions() {
    this.level.chickens.forEach((chicken) => {
      if (this.character.isCollidingOffset(chicken)) {
        // Endboss: nur Schaden, kein Stomp möglich (auch wenn tot, für Dead-Animation)
        if (chicken instanceof Endboss) {
          if (!chicken.isDead && !this.character.hurt()) {
            this.character.hit();
            this.statusbar[0].setPercentage(this.character.energy);
          }
          return;
        }
        
        // Normale Chickens: nur wenn lebend
        if (chicken.isDead) return;
        
        // Normale Chickens: Stomp-Logik
        const characterBottom =
          this.character.y +
          this.character.height -
          this.character.offset.bottom;
        const chickenMidY = chicken.y + chicken.height / 2;
        const isAirborne = this.character.isAboveGround();
        const isStomp =
          isAirborne &&
          this.character.speedY < 0 &&
          characterBottom <= chickenMidY;
        if (isStomp && !chicken.isDead) {
          chicken.playDead();
          this.character.y =
            chicken.y - (this.character.height - this.character.offset.bottom);
          this.character.speedY = 15;
          // Chicken bleibt im Array, wird nur als tot markiert
        } else if (!chicken.isDead && !this.character.hurt()) {
          this.character.hit();
          this.statusbar[0].setPercentage(this.character.energy);
        }
      }
    });
  }

  checkCollisionsCoins() {
    for (let i = 0; i < this.level.coins.length; i++) {
      let coin = this.level.coins[i];
      if (this.character.isCollidingOffset(coin) && !coin.collected) {
        console.log("Kollision mit Coin erkannt!");
        // Sound über Coin-Instanz abspielen
        if (typeof coin.collect === "function") {
          coin.collect();
        }
        coin.collected = true; // Coin als gesammelt markieren, aber im Array lassen
        // Coins-Statusbar um eine Stufe (20%) erhöhen
        const coinsBar = this.statusbar[1];
        const newPercentage = Math.min(100, (coinsBar.percentage || 0) + 20);
        coinsBar.setPercentage(newPercentage);
        break;
      }
    }
  }

  checkCollisionsBottles() {
    for (let i = 0; i < this.level.bottles.length; i++) {
      let bottle = this.level.bottles[i];
      if (this.character.isCollidingOffset(bottle) && !bottle.collected) {
        console.log("Kollision mit Bottle erkannt!");
        if (typeof bottle.collect === "function") {
          bottle.collect();
        }
        bottle.collected = true; // Flasche als gesammelt markieren, aber im Array lassen
        const bottleBar = this.statusbar[2];
        const newPercentage = Math.min(100, (bottleBar.percentage || 0) + 20);
        bottleBar.setPercentage(newPercentage);
        break;
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.background);
    // Nur nicht gesammelte Coins zeichnen
    this.level.coins.forEach(coin => {
      if (!coin.collected) {
        this.addToMap(coin);
      }
    });
    // Nur nicht gesammelte Flaschen zeichnen
    this.level.bottles.forEach(bottle => {
      if (!bottle.collected) {
        this.addToMap(bottle);
      }
    });
    this.addObjectsToMap(this.level.clouds);
    // Chickens zeichnen (Endboss auch wenn tot für Dead-Animation)
    this.level.chickens.forEach(chicken => {
      if (chicken instanceof Endboss || !chicken.isDead) {
        this.addToMap(chicken);
      }
    });
    // Endboss-Bar über dem Boss positionieren (nur wenn Boss noch lebt)
    const boss = this.level.chickens.find((e) => e instanceof Endboss);
    if (boss && this.endbossBar && !boss.isDead) {
      this.endbossBar.x = boss.x + (boss.width - this.endbossBar.width) / 2;
      this.endbossBar.y = boss.y - 20;
      this.addToMap(this.endbossBar);
    }
    this.addToMap(this.character);
    this.ctx.translate(-this.camera_x, 0);
    this.addObjectsToMap(this.statusbar);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);
    
    // Endscreen als Overlay zeichnen (ohne Kamera-Transform)
    this.endscreen.draw(this.ctx);
    
    requestAnimationFrame(this.draw.bind(this));
  }

  addObjectsToMap(objects) {
    objects.forEach((obj) => {
      this.addToMap(obj);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);
    mo.drawFrameOffset(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  checkBottleHitsChickens() {
    for (let b = 0; b < this.throwableObjects.length; b++) {
      const bottle = this.throwableObjects[b];
      for (let c = 0; c < this.level.chickens.length; c++) {
        const chicken = this.level.chickens[c];
        if (bottle.isCollidingOffset(chicken)) {
          // Treffer auf Endboss: 1s Hurt-Animation, stehen bleiben, nicht entfernen
          if (chicken instanceof Endboss) {
            if (!chicken.isDead && typeof chicken.takeHit === "function") {
              chicken.takeHit();
            }
            if (typeof bottle.onLand === "function") {
              bottle.onLand();
            }
            setTimeout(() => {
              const idxBottle = this.throwableObjects.indexOf(bottle);
              if (idxBottle >= 0) this.throwableObjects.splice(idxBottle, 1);
            }, 400);
            break;
          }
          // Normales Chicken: nur wenn lebend
          if (chicken.isDead) continue;
          // Normales Chicken: töten (bleibt im Array)
          if (!chicken.isDead) {
            chicken.playDead();
            if (typeof bottle.onLand === "function") {
              bottle.onLand();
            }
            setTimeout(() => {
              const idxBottle = this.throwableObjects.indexOf(bottle);
              if (idxBottle >= 0) this.throwableObjects.splice(idxBottle, 1);
            }, 400);
            // Chicken bleibt im Array, wird nur als tot markiert
            break;
          }
        }
      }
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  restartGame() {
    // Endscreen komplett verstecken und zurücksetzen
    this.endscreen.hide();
    this.endscreen.visible = false;
    this.endscreen.type = null;
    this.endscreen.currentImage = null;
    this.endscreen.img = null;
    
    // Alten Character stoppen
    if (this.character && this.character.stopAllIntervals) {
      this.character.stopAllIntervals();
    }
    
    // Camera sofort zurücksetzen
    this.camera_x = 0;
    
    // Character komplett neu erstellen
    this.character = new Character();
    this.character.world = this;
    
    // Level komplett neu laden (alle Objekte werden neu erstellt)
    this.level = level;
    
    // Game wieder starten
    this.gameRunning = true;
    
    // Hintergrundmusik neu starten
    this.backgroundMusic.currentTime = 0;
    this.backgroundMusic.play().catch(e => {
      console.log('Musik konnte nicht neu gestartet werden:', e);
    });
    
    // Statusbars neu erstellen
    this.statusbar = [
      Object.assign(new Statusbar("health"), { y: -10 }),
      Object.assign(new Statusbar("coins"), { y: 30 }),
      Object.assign(new Statusbar("bottle"), { y: 70 }),
    ];
    
    // Statusbars auf volle Werte zurücksetzen
    this.statusbar[0].setPercentage(100); // Health
    this.statusbar[1].setPercentage(0);   // Coins
    this.statusbar[2].setPercentage(0);   // Bottles
    
    // Endboss-Bar neu erstellen
    this.endbossBar = new Statusbar("endboss");
    
    // Alle Objekte im Level zurücksetzen
    this.level.chickens.forEach(chicken => {
      chicken.world = this;
      if (chicken instanceof Endboss) {
        // Endboss komplett zurücksetzen
        chicken.isDead = false;
        chicken.isHurt = false;
        chicken.lives = 3;
        chicken.health = 100;
        chicken.state = 'walking';
        chicken.alertPlayed = false;
        chicken.deadAnimationPlayed = false;
        chicken.deadFrameCount = 0;
        chicken.width = 300;
        chicken.height = 300;
        chicken.x = 2000; // Ursprüngliche Position
        chicken.y = 150;  // Ursprüngliche Position
        chicken.speed = 0.15 + Math.random() * 0.25; // Ursprüngliche Geschwindigkeit
        chicken.hurtEndAt = 0;
        chicken.lastHitTime = 0;
        chicken.alertEndTime = 0;
        chicken.attackEndTime = 0;
        chicken.originalSpeed = chicken.speed;
        chicken.attackSpeed = chicken.originalSpeed * 10;
        chicken.deadAnimationEndTime = 0;
        chicken.lastDeadFrameAt = 0;
        chicken.currentImage = 0;
        chicken.img = chicken.imageCache[chicken.IMAGES_WALKING[0]];
      } else {
        // Normale Chickens zurücksetzen
        chicken.isDead = false;
        chicken.currentImage = 0;
        chicken.img = chicken.imageCache[chicken.IMAGES_WALKING[0]];
        chicken.speed = 0.5 + Math.random() * 0.75; // Zufällige Geschwindigkeit neu setzen
        chicken.resetPosition(); // Position auf ursprünglichen Spawn-Bereich zurücksetzen
      }
    });
    
    this.level.coins.forEach(coin => {
      coin.world = this;
      coin.collected = false;
    });
    
    this.level.bottles.forEach(bottle => {
      bottle.world = this;
      bottle.collected = false;
    });
    
    // Throwable Objects leeren
    this.throwableObjects = [];
    
    // Space-Taste zurücksetzen
    this.spaceWasDown = false;
    
    // Canvas-Transform zurücksetzen
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    // Keyboard-Events neu setzen
    this.setupKeyboardEvents();
    
    // World-Verbindungen neu setzen
    this.setWorld();
  }

}
