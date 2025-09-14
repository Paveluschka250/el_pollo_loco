class Endscreen extends DrawableObject {
  IMAGES_GAME_LOSE = [
    "assets/img/You won, you lost/Game over A.png",
    "assets/img/You won, you lost/Game Over.png",
    "assets/img/You won, you lost/You lost b.png",
    "assets/img/You won, you lost/You lost.png",
  ];
  IMAGES_GAME_WIN = [
    "assets/img/You won, you lost/You Win A.png",
    "assets/img/You won, you lost/You win B.png",
    "assets/img/You won, you lost/You won A.png",
    "assets/img/You won, you lost/You Won B.png",
  ];

  constructor() {
    super();
    this.visible = false;
    this.type = null;
    this.currentImage = null;
    this.imageWidth = 0;
    this.imageHeight = 0;
    this.maxWidth = 400;
    this.maxHeight = 200;
    this.canvasWidth = 720;
    this.canvasHeight = 480;
    this.soundManager = SoundManager.getInstance();
    this.winSound = this.soundManager.createSound("assets/audio/win.mp3");
    this.loseSound = this.soundManager.createSound("assets/audio/lose.mp3");
    this.buttonWidth = 120;
    this.buttonHeight = 40;
    this.buttonSpacing = 20;
    this.loadImages(this.IMAGES_GAME_LOSE);
    this.loadImages(this.IMAGES_GAME_WIN);
  }

  showWin() {
    this.type = "win";
    this.visible = true;
    const randomIndex = Math.floor(Math.random() * this.IMAGES_GAME_WIN.length);
    this.currentImage = this.IMAGES_GAME_WIN[randomIndex];
    this.img = this.imageCache[this.currentImage];
    this.calculateImageDimensions();
    this.soundManager.playSound(this.winSound);
  }

  showLose() {
    this.type = "lose";
    this.visible = true;
    const randomIndex = Math.floor(
      Math.random() * this.IMAGES_GAME_LOSE.length
    );
    this.currentImage = this.IMAGES_GAME_LOSE[randomIndex];
    this.img = this.imageCache[this.currentImage];
    this.calculateImageDimensions();
    this.soundManager.playSound(this.loseSound);
  }

  calculateImageDimensions() {
    if (this.img) {
      const originalWidth = this.img.naturalWidth;
      const originalHeight = this.img.naturalHeight;
      const aspectRatio = originalWidth / originalHeight;
      let scaleByWidth = this.maxWidth / originalWidth;
      let scaleByHeight = this.maxHeight / originalHeight;
      const scale = Math.min(scaleByWidth, scaleByHeight);
      this.imageWidth = originalWidth * scale;
      this.imageHeight = originalHeight * scale;
    }
  }

  hide() {
    this.visible = false;
    this.type = null;
    this.currentImage = null;
    this.img = null;
    this.winSound.pause();
    this.loseSound.pause();
    this.winSound.currentTime = 0;
    this.loseSound.currentTime = 0;
  }

  draw(ctx) {
    if (!this.visible || !this.img) return;
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    const imageX = (this.canvasWidth - this.imageWidth) / 2;
    const imageY = (this.canvasHeight - this.imageHeight) / 2;
    ctx.drawImage(this.img, imageX, imageY, this.imageWidth, this.imageHeight);
    this.drawButtons(ctx, imageY + this.imageHeight + 30);
  }

  drawButtons(ctx, startY) {
    const totalButtonWidth = this.buttonWidth * 2 + this.buttonSpacing;
    const startX = (this.canvasWidth - totalButtonWidth) / 2;
    this.drawButton(ctx, startX, startY, "Main Menu", "#4CAF50");
    const retryX = startX + this.buttonWidth + this.buttonSpacing;
    this.drawButton(ctx, retryX, startY, "Retry", "#2196F3");
  }

  drawButton(ctx, x, y, text, color) {
    this.drawButtonShadow(ctx, x, y);
    this.drawButtonGradient(ctx, x, y);
    this.drawButtonBorders(ctx, x, y);
    this.drawButtonText(ctx, x, y, text);
  }

  drawButtonShadow(ctx, x, y) {
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(x + 3, y + 3, this.buttonWidth, this.buttonHeight);
  }

  drawButtonGradient(ctx, x, y) {
    const gradient = ctx.createLinearGradient(x, y, x, y + this.buttonHeight);
    gradient.addColorStop(0, "#FFD700");
    gradient.addColorStop(0.5, "#FF8C00");
    gradient.addColorStop(1, "#FF4500");
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, this.buttonWidth, this.buttonHeight);
  }

  drawButtonBorders(ctx, x, y) {
    this.drawButtonTopBorder(ctx, x, y);
    this.drawButtonBottomBorder(ctx, x, y);
  }

  drawButtonTopBorder(ctx, x, y) {
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + this.buttonWidth, y);
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + this.buttonHeight);
    ctx.stroke();
  }

  drawButtonBottomBorder(ctx, x, y) {
    ctx.strokeStyle = "#8B4513";
    ctx.beginPath();
    ctx.moveTo(x + this.buttonWidth, y);
    ctx.lineTo(x + this.buttonWidth, y + this.buttonHeight);
    ctx.moveTo(x, y + this.buttonHeight);
    ctx.lineTo(x + this.buttonWidth, y + this.buttonHeight);
    ctx.stroke();
  }

  drawButtonText(ctx, x, y, text) {
    ctx.font = 'bold 18px "rye", Arial, sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#8B4513";
    ctx.fillText(text, x + this.buttonWidth / 2 + 2, y + this.buttonHeight / 2 + 2);
    ctx.fillStyle = "#000000";
    ctx.fillText(text, x + this.buttonWidth / 2, y + this.buttonHeight / 2);
  }

  isButtonClicked(mouseX, mouseY, buttonX, buttonY) {
    return (
      mouseX >= buttonX &&
      mouseX <= buttonX + this.buttonWidth &&
      mouseY >= buttonY &&
      mouseY <= buttonY + this.buttonHeight
    );
  }

  handleClick(mouseX, mouseY) {
    if (!this.visible) return;
    
    const buttonPositions = this.calculateButtonPositions();
    this.checkButtonClicks(mouseX, mouseY, buttonPositions);
  }

  calculateButtonPositions() {
    const imageY = (this.canvasHeight - this.imageHeight) / 2;
    const buttonY = imageY + this.imageHeight + 30;
    const totalButtonWidth = this.buttonWidth * 2 + this.buttonSpacing;
    const startX = (this.canvasWidth - totalButtonWidth) / 2;
    const retryX = startX + this.buttonWidth + this.buttonSpacing;
    
    return { startX, retryX, buttonY };
  }

  checkButtonClicks(mouseX, mouseY, positions) {
    if (this.isButtonClicked(mouseX, mouseY, positions.retryX, positions.buttonY)) {
      this.retryGame();
    }
    if (this.isButtonClicked(mouseX, mouseY, positions.startX, positions.buttonY)) {
      this.goToMainMenu();
    }
  }

  retryGame() {
    this.hide();
    if (window.world) {
      window.world.restartGame();
    }
  }

  goToMainMenu() {
    this.hide();
    const gameContainer = document.getElementById("game-container");
    if (gameContainer) {
      gameContainer.style.display = "none";
    }
    const mainMenu = document.getElementById("main-menu");
    if (mainMenu) {
      mainMenu.style.display = "flex";
    }
    if (window.world) {
      window.world.pauseGame();
    }
  }
}
