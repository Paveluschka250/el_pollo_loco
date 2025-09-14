class CollisionManager {
  constructor(world) {
    this.world = world;
  }

  checkCollisions() {
    this.world.level.chickens.forEach((chicken) => {
      if (this.world.character.isCollidingOffset(chicken)) {
        this.handleChickenCollision(chicken);
      }
    });
  }

  handleChickenCollision(chicken) {
    if (chicken instanceof Endboss) {
      this.handleEndbossCollision(chicken);
      return;
    }

    if (chicken.isDead) return;

    this.handleNormalChickenCollision(chicken);
  }

  handleEndbossCollision(chicken) {
    if (!chicken.isDead && !this.world.character.die()) {
      this.world.character.energy = 0;
      this.world.statusbar[0].setPercentage(this.world.character.energy);
    }
  }

  handleNormalChickenCollision(chicken) {
    const isStomp = this.checkStompCondition(chicken);
    if (isStomp && !chicken.isDead) {
      this.executeStomp(chicken);
    } else if (!chicken.isDead && !this.world.character.hurt()) {
      this.world.character.hit();
      this.world.statusbar[0].setPercentage(this.world.character.energy);
    }
  }

  checkStompCondition(chicken) {
    const characterBottom =
      this.world.character.y + this.world.character.height - this.world.character.offset.bottom;
    const chickenMidY = chicken.y + chicken.height / 2;
    const isAirborne = this.world.character.isAboveGround();
    return (
      isAirborne && this.world.character.speedY < 0 && characterBottom <= chickenMidY
    );
  }

  executeStomp(chicken) {
    chicken.playDead();
    this.world.character.y =
      chicken.y - (this.world.character.height - this.world.character.offset.bottom);
    this.world.character.speedY = 15;
  }

  checkCollisionsCoins() {
    for (let i = 0; i < this.world.level.coins.length; i++) {
      let coin = this.world.level.coins[i];
      if (this.world.character.isCollidingOffset(coin) && !coin.collected) {
        if (typeof coin.collect === "function") {
          coin.collect();
        }
        coin.collected = true;
        const coinsBar = this.world.statusbar[1];
        const newPercentage = Math.min(100, (coinsBar.percentage || 0) + 20);
        coinsBar.setPercentage(newPercentage);
        break;
      }
    }
  }

  checkCollisionsBottles() {
    for (let i = 0; i < this.world.level.bottles.length; i++) {
      let bottle = this.world.level.bottles[i];
      if (this.world.character.isCollidingOffset(bottle) && !bottle.collected) {
        if (typeof bottle.collect === "function") {
          bottle.collect();
        }
        bottle.collected = true;
        const bottleBar = this.world.statusbar[2];
        const newPercentage = Math.min(100, (bottleBar.percentage || 0) + 20);
        bottleBar.setPercentage(newPercentage);
        break;
      }
    }
  }

  checkBottleHitsChickens() {
    for (let b = 0; b < this.world.throwableObjects.length; b++) {
      const bottle = this.world.throwableObjects[b];
      this.checkBottleAgainstChickens(bottle);
    }
  }

  checkBottleAgainstChickens(bottle) {
    if (bottle.hasLanded || bottle.removed) return;
    
    for (let c = 0; c < this.world.level.chickens.length; c++) {
      const chicken = this.world.level.chickens[c];
      if (bottle.isCollidingOffset(chicken)) {
        this.handleBottleChickenCollision(bottle, chicken);
        break;
      }
    }
  }

  handleBottleChickenCollision(bottle, chicken) {
    if (chicken instanceof Endboss) {
      this.handleBottleEndbossCollision(bottle, chicken);
    } else if (!chicken.isDead) {
      this.handleBottleNormalChickenCollision(bottle, chicken);
    }
  }

  handleBottleEndbossCollision(bottle, chicken) {
    if (!chicken.isDead && !chicken.isHurt && typeof chicken.takeHit === "function") {
      chicken.takeHit();
    }
    this.removeBottleAfterHit(bottle);
  }

  handleBottleNormalChickenCollision(bottle, chicken) {
    chicken.playDead();
    this.removeBottleAfterHit(bottle);
  }

  removeBottleAfterHit(bottle) {
    if (typeof bottle.onLand === "function") {
      bottle.onLand();
    }
    setTimeout(() => {
      const idxBottle = this.world.throwableObjects.indexOf(bottle);
      if (idxBottle >= 0) this.world.throwableObjects.splice(idxBottle, 1);
    }, 400);
  }

  checkEndbossBottles() {
    const boss = this.world.level.chickens.find((e) => e instanceof Endboss);
    if (boss && boss.getThrownBottles) {
      const endbossBottles = boss.getThrownBottles();
      for (let b = 0; b < endbossBottles.length; b++) {
        const bottle = endbossBottles[b];
        this.checkEndbossBottleAgainstCharacter(bottle);
      }
    }
  }

  checkEndbossBottleAgainstCharacter(bottle) {
    if (bottle.hasLanded || bottle.removed) return;
    
    if (bottle.isCollidingOffset(this.world.character)) {
      this.handleEndbossBottleHitCharacter(bottle);
    }
  }

  handleEndbossBottleHitCharacter(bottle) {
    if (!this.world.character.die()) {
      this.world.character.hit();
      this.world.statusbar[0].setPercentage(this.world.character.energy);
    }
    this.removeEndbossBottle(bottle);
  }

  removeEndbossBottle(bottle) {
    const boss = this.world.level.chickens.find((e) => e instanceof Endboss);
    if (boss && boss.thrownBottles) {
      const index = boss.thrownBottles.indexOf(bottle);
      if (index > -1) {
        boss.thrownBottles.splice(index, 1);
      }
    }
  }
}
