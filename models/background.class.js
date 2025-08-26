class Background extends MovableObject {

    constructor(imagePath, x) {
        super();
        this.loadImage(imagePath, x);
        this.x = x;
        this.y = 0;
        this.width = 720;
        this.height = 480;
    }
}