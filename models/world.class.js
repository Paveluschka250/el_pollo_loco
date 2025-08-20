class World {
    canvas
    ctx;
    character = new Character();
    chicken1 = new Chicken();
    chicken2 = new Chicken();
    chicken3 = new Chicken();

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.ctx.drawImage(this.chicken1.img, this.chicken1.x, this.chicken1.y, this.chicken1.width, this.chicken1.height);
        this.ctx.drawImage(this.chicken2.img, this.chicken2.x, this.chicken2.y, this.chicken2.width, this.chicken2.height);
        this.ctx.drawImage(this.chicken3.img, this.chicken3.x, this.chicken3.y, this.chicken3.width, this.chicken3.height);
        this.ctx.drawImage(this.character.img, this.character.x, this.character.y, this.character.width, this.character.height);
        requestAnimationFrame(this.draw.bind(this));
    }
}