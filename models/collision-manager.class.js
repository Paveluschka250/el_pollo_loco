class CollisionManager {
  /**
   * Creates a new CollisionManager instance
   * @param {World} world - World instance
   */
  constructor(world) {
    this.world = world;
  }

  /**
   * Checks all collisions between character and chickens
   */
  checkCollisions() {
    this.world.level.chickens.forEach((chicken) => {
      if (this.world.character.isCollidingOffset(chicken)) {
        this.handleChickenCollision(chicken);
      }
    });
  }

  /**
   * Handles collision between character and a chicken
   * @param {Chicken|Endboss} chicken - Chicken or Endboss instance
   */
  handleChickenCollision(chicken) {
    if (chicken instanceof Endboss) {
      this.handleEndbossCollision(chicken);
      return;
    }

    if (chicken.isDead) return;

    this.handleNormalChickenCollision(chicken);
  }

  /**
   * Handles collision between character and endboss
   * @param {Endboss} chicken - Endboss instance
   */
  handleEndbossCollision(chicken) {
    if (!chicken.isDead && !this.world.character.die()) {
      this.world.character.energy = 0;
      this.world.statusbar[0].setPercentage(this.world.character.energy);
    }
  }

  /**
   * Handles collision between character and normal chicken
   * @param {Chicken} chicken - Chicken instance
   */
  handleNormalChickenCollision(chicken) {
    const isStomp = this.checkStompCondition(chicken);
    if (isStomp && !chicken.isDead) {
      this.executeStomp(chicken);
    } else if (!chicken.isDead && !this.world.character.hurt()) {
      this.world.character.hit();
      this.world.statusbar[0].setPercentage(this.world.character.energy);
    }
  }

  /**
   * Checks if character can stomp on chicken based on position and movement
   * @param {Chicken} chicken - Chicken instance to check stomp condition for
   * @returns {boolean} True if character can stomp (airborne, falling, and positioned above chicken)
   */
  checkStompCondition(chicken) {
    const characterBottom =
      this.world.character.y + this.world.character.height - this.world.character.offset.bottom;
    const chickenMidY = chicken.y + chicken.height / 2;
    const isAirborne = this.world.character.isAboveGround();
    return (
      isAirborne && this.world.character.speedY < 0 && characterBottom <= chickenMidY
    );
  }

  /**
   * Executes stomp action on chicken, killing it and bouncing character
   * @param {Chicken} chicken - Chicken instance to stomp and kill
   */
  executeStomp(chicken) {
    chicken.playDead();
    this.world.character.y =
      chicken.y - (this.world.character.height - this.world.character.offset.bottom);
    this.world.character.speedY = 15;
  }

  /**
   * Checks collisions between character and coins
   */
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

  /**
   * Checks collisions between character and bottles
   */
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

  /**
   * Checks if thrown bottles hit chickens
   */
  checkBottleHitsChickens() {
    for (let b = 0; b < this.world.throwableObjects.length; b++) {
      const bottle = this.world.throwableObjects[b];
      this.checkBottleAgainstChickens(bottle);
    }
  }

  /**
   * Checks if a specific bottle hits any chicken
   * @param {ThrowableObject} bottle - Bottle instance to check
   */
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

  /**
   * Handles collision between bottle and chicken
   * @param {ThrowableObject} bottle - Bottle instance
   * @param {Chicken|Endboss} chicken - Chicken or Endboss instance
   */
  handleBottleChickenCollision(bottle, chicken) {
    if (chicken instanceof Endboss) {
      this.handleBottleEndbossCollision(bottle, chicken);
    } else if (!chicken.isDead) {
      this.handleBottleNormalChickenCollision(bottle, chicken);
    }
  }

  /**
   * Handles collision between bottle and endboss
   * @param {ThrowableObject} bottle - Bottle instance
   * @param {Endboss} chicken - Endboss instance
   */
  handleBottleEndbossCollision(bottle, chicken) {
    if (!chicken.isDead && !chicken.isHurt && typeof chicken.takeHit === "function") {
      chicken.takeHit();
    }
    this.removeBottleAfterHit(bottle);
  }

  /**
   * Handles collision between bottle and normal chicken
   * @param {ThrowableObject} bottle - Bottle instance
   * @param {Chicken} chicken - Chicken instance
   */
  handleBottleNormalChickenCollision(bottle, chicken) {
    chicken.playDead();
    this.removeBottleAfterHit(bottle);
  }

  /**
   * Removes bottle after it hits a target
   * @param {ThrowableObject} bottle - Bottle instance to remove
   */
  removeBottleAfterHit(bottle) {
    if (typeof bottle.onLand === "function") {
      bottle.onLand();
    }
    setTimeout(() => {
      const idxBottle = this.world.throwableObjects.indexOf(bottle);
      if (idxBottle >= 0) this.world.throwableObjects.splice(idxBottle, 1);
    }, 400);
  }

  /**
   * Checks if endboss bottles hit the character
   */
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

  /**
   * Checks if an endboss bottle hits the character
   * @param {EndbossBottle} bottle - Endboss bottle instance
   */
  checkEndbossBottleAgainstCharacter(bottle) {
    if (bottle.hasLanded || bottle.removed) return;
    
    if (bottle.isCollidingOffset(this.world.character)) {
      this.handleEndbossBottleHitCharacter(bottle);
    }
  }

  /**
   * Handles when endboss bottle hits character
   * @param {EndbossBottle} bottle - Endboss bottle instance
   */
  handleEndbossBottleHitCharacter(bottle) {
    if (!this.world.character.die()) {
      this.world.character.hit();
      this.world.statusbar[0].setPercentage(this.world.character.energy);
    }
    this.removeEndbossBottle(bottle);
  }

  /**
   * Removes endboss bottle from the game
   * @param {EndbossBottle} bottle - Endboss bottle instance to remove
   */
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
