class MovableObject {
    x = 0;
    y = 0;
    width = 100;
    height = 100;
    img;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }
}
