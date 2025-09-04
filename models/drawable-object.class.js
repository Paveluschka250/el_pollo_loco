class DrawableObject {
  x = 0;
  y = 0;
  width = 100;
  height = 100;
  img;
  imageCache = {};
  currentImage = 0;

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

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {
    if (this instanceof Character || this instanceof Chicken || this instanceof Coin || this instanceof Bottle || this instanceof ThrowableObject) {
      ctx.beginPath();
      ctx.lineWidth = "1";
      ctx.strokeStyle = "red";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }

  drawFrameOffset(ctx) {
    if (this instanceof Character || this instanceof Chicken || this instanceof Coin || this instanceof Bottle || this instanceof ThrowableObject) {
      ctx.beginPath();
      ctx.lineWidth = "2";
      ctx.strokeStyle = "blue";
      ctx.rect(
        this.x + this.offset.left,
        this.y + this.offset.top,
        this.width - this.offset.right - this.offset.left,
        this.height - this.offset.top - this.offset.bottom
      );
      ctx.stroke();
    }
  }
}
