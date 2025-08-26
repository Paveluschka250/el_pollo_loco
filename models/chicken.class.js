class Chicken extends MovableObject {

    IMAGES_WALKING = [
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];
    

    constructor() {
        super();
        this.loadImage('assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.x = 200 + Math.random() * 500; // Random x position
        this.y = 360
        this.width = 60; // Initial width
        this.height = 60; // Initial height
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
    }

    animate() {
        this.moveLeft();
        setInterval(() => {
            this.currentImage = (this.currentImage + 1) % this.IMAGES_WALKING.length;
            this.img = this.imageCache[this.IMAGES_WALKING[this.currentImage]];
        }, 100);
    }
}