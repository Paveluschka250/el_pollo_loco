class Coin extends MovableObject {
  IMAGES_COIN = [
    "assets/img/8_coin/coin_1.png",
    "assets/img/8_coin/coin_2.png",
  ];
  /**
   * Creates a new Coin instance
   * @param {number} xMin - Minimum x position
   * @param {number} xMax - Maximum x position
   */
  constructor(xMin = 0, xMax = 500) {
    super();
    this.soundManager = SoundManager.getInstance();
    this.pickupSound = this.soundManager.createSound('assets/audio/coin.mp3');
    this.loadImage("assets/img/8_coin/coin_1.png");
    this.loadImages(this.IMAGES_COIN);
    this.x = Math.random() * (xMax - xMin) + xMin;
    this.y = 100 + Math.random() * 180;
    this.width = 120;
    this.height = 120;
    this.offset = {
      left: 40,
      top: 40,
      bottom: 40,
      right: 40,
    };
    this.animate();
  }

  /**
   * Animates the coin by cycling through images
   */
  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_COIN);
    }, 200);
  }

  /**
   * Plays pickup sound when coin is collected
   */
  collect() {
    this.soundManager.playSound(this.pickupSound);
  }
}
