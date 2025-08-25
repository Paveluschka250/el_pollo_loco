class Chicken extends MovableObject {

    constructor() {
        super();
        this.loadImage('assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = 200 + Math.random() * 500; // Random x position
        this.y = 360
        this.width = 60; // Initial width
        this.height = 60; // Initial height
    }
}