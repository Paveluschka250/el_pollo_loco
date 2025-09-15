class MovableObject extends DrawableObject {
  speed = 0.5;
  otherDirection = false;
  speedY = 0;
  acceleration = 1;
  offset = {
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  };
  energy = 100;
  lastHit = 0;

  /**
   * Checks if this object is colliding with another object
   * @param {MovableObject} mo - Other movable object
   * @returns {boolean} True if colliding
   */
  isColliding(mo) {
    return (
      this.x < mo.x + mo.width &&
      this.x + this.width > mo.x &&
      this.y < mo.y + mo.height &&
      this.y + this.height > mo.y
    );
  }

  /**
   * Checks collision with offset boundaries for more precise collision detection
   * Uses object offsets to create smaller collision areas for better gameplay feel
   * @param {MovableObject} mo - Other movable object to check collision with
   * @returns {boolean} True if colliding with offset boundaries
   */
  isCollidingOffset(mo) {
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    );
  }

  /**
   * Plays animation from image array
   * @param {Array} images - Array of image paths
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Applies gravity to the object with continuous physics simulation
   * Updates position based on vertical speed and applies downward acceleration
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 60);
  }

  /**
   * Checks if object is above ground
   * @returns {boolean} True if above ground
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 225;
    }
  }

  /**
   * Makes the object jump
   */
  jump() {
    this.speedY = 20;
  }

  /**
   * Moves the object to the right
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the object to the left
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Handles object being hit
   */
  hit() {
    this.energy -= 20;
    if (this.energy <= 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Checks if object is dead
   * @returns {boolean} True if dead
   */
  die() {
    return this.energy == 0;
  }

  /**
   * Checks if object is in hurt state
   * @returns {boolean} True if hurt
   */
  hurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 2;
  }
}
