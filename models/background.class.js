class Background extends MovableObject {
    /**
     * Creates a new Background instance
     * @param {string} imagePath - Path to background image
     * @param {number} x - X position of background
     */
    constructor(imagePath, x) {
        super();
        this.loadImage(imagePath, x);
        this.x = x;
        this.y = 0;
        this.width = 720;
        this.height = 480;
    }
}