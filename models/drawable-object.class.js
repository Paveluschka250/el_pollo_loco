class DrawableObject {
  x = 0;
  y = 0;
  width = 100;
  height = 100;
  img;
  imageCache = {};
  currentImage = 0;

  /**
   * Loads a single image
   * @param {string} path - Image path
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Loads multiple images into cache
   * @param {Array} arr - Array of image paths
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Draws the object on canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Draws debug frame around object
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  drawFrame(ctx) {
    if (this instanceof Endboss) {
      ctx.beginPath();
      ctx.lineWidth = 0;
      ctx.strokeStyle = "red";
      ctx.rect(this.x, this.y, this.width, this.height);
    }
  }

  /**
   * Draws debug frame with offset
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  drawFrameOffset(ctx) {
    if (this instanceof Endboss) {
      ctx.beginPath();
      ctx.lineWidth = 0;
      ctx.strokeStyle = "blue";
      ctx.rect(
        this.x + this.offset.left,
        this.y + this.offset.top,
        this.width - this.offset.right - this.offset.left,
        this.height - this.offset.top - this.offset.bottom
      );
    }
  }
}
