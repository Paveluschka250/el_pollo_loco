class Bottle extends MovableObject {
    /**
     * Creates a new Bottle instance
     * @param {number} xMin - Minimum x position
     * @param {number} xMax - Maximum x position
     * @param {string} imagePath - Path to bottle image
     */
    constructor(xMin = 0, xMax = 500, imagePath = "assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png") {
        super();
        this.soundManager = SoundManager.getInstance();
        this.pickupSound = this.soundManager.createSound('assets/audio/bottle.mp3');
        this.loadImage(imagePath);
        this.x = Math.random() * (xMax - xMin) + xMin;
        this.y = 350;
        this.width = 80;
        this.height = 80;
        this.offset = {
          left: 32,
          top: 15,
          bottom: 12,
          right: 20,
        };
      }
  
    /**
     * Plays pickup sound when bottle is collected
     */
    collect() {
        this.soundManager.playSound(this.pickupSound);
    }
  }
