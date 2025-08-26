class MovableObject {
  x = 0;
  y = 0;
  width = 100;
  height = 100;
  img;
  imageCache = {};
  currentImage = 0;
  speed = 0.5;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  moveLeft() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }
}
