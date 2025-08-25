class Cloud extends MovableObject {

    constructor() {
        super();
        this.loadImage('assets/img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 500; 
        this.y = Math.random() * 50; 
        this.width = 300;
        this.height = 150;
        this.animate();
    }

    animate() {
      setInterval(() => {
        this.x -= 0.5;
        if (this.x < -300) this.x = 700;
      }, 1000 / 60);
    }
}