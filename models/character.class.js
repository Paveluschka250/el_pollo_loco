class Character extends MovableObject {

    constructor() {
        super();
        this.loadImage('assets/img/2_character_pepe/1_idle/idle/I-1.png');
        this.x = 100; // Initial x position
        this.y = 200; // Initial y position
        this.width = 120; // Initial width
        this.height = 200; // Initial height
    }
}