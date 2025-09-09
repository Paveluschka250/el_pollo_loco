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
        this.type = null; // 'win' oder 'lose'
        this.currentImage = null;
        this.imageWidth = 400; // Feste Breite für Bilder
        this.imageHeight = 0; // Wird automatisch berechnet
        this.canvasWidth = 720;
        this.canvasHeight = 480;
        this.winSound = new Audio('assets/audio/win.mp3');
        this.loseSound = new Audio('assets/audio/lose.mp3');
        this.buttonWidth = 120;
        this.buttonHeight = 40;
        this.buttonSpacing = 20;
        this.loadImages(this.IMAGES_GAME_LOSE);
        this.loadImages(this.IMAGES_GAME_WIN);
    }

    showWin() {
        this.type = 'win';
        this.visible = true;
        // Zufälliges Win-Bild auswählen
        const randomIndex = Math.floor(Math.random() * this.IMAGES_GAME_WIN.length);
        this.currentImage = this.IMAGES_GAME_WIN[randomIndex];
        this.img = this.imageCache[this.currentImage];
        this.calculateImageDimensions();
        // Win-Sound abspielen
        this.winSound.currentTime = 0;
        this.winSound.play();
    }

    showLose() {
        this.type = 'lose';
        this.visible = true;
        // Zufälliges Lose-Bild auswählen
        const randomIndex = Math.floor(Math.random() * this.IMAGES_GAME_LOSE.length);
        this.currentImage = this.IMAGES_GAME_LOSE[randomIndex];
        this.img = this.imageCache[this.currentImage];
        this.calculateImageDimensions();
        // Lose-Sound abspielen
        this.loseSound.currentTime = 0;
        this.loseSound.play();
    }

    calculateImageDimensions() {
        if (this.img) {
            // Verhältnis beibehalten: Höhe = (Originalhöhe / Originalbreite) * neue Breite
            this.imageHeight = (this.img.naturalHeight / this.img.naturalWidth) * this.imageWidth;
        }
    }

    hide() {
        this.visible = false;
        this.type = null;
        this.currentImage = null;
        this.img = null;
        // Sounds stoppen
        this.winSound.pause();
        this.loseSound.pause();
        this.winSound.currentTime = 0;
        this.loseSound.currentTime = 0;
    }

    draw(ctx) {
        if (!this.visible || !this.img) return;
        
        // Transparenter schwarzer Hintergrund
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        // Bild zentral positionieren
        const imageX = (this.canvasWidth - this.imageWidth) / 2;
        const imageY = (this.canvasHeight - this.imageHeight) / 2;
        
        // Bild mit korrekten Proportionen zeichnen
        ctx.drawImage(this.img, imageX, imageY, this.imageWidth, this.imageHeight);
        
        // Buttons zeichnen
        this.drawButtons(ctx, imageY + this.imageHeight + 30);
    }

    drawButtons(ctx, startY) {
        const totalButtonWidth = (this.buttonWidth * 2) + this.buttonSpacing;
        const startX = (this.canvasWidth - totalButtonWidth) / 2;
        
        // Main Menu Button
        this.drawButton(ctx, startX, startY, 'Main Menu', '#4CAF50');
        
        // Retry Button
        const retryX = startX + this.buttonWidth + this.buttonSpacing;
        this.drawButton(ctx, retryX, startY, 'Retry', '#2196F3');
    }

    drawButton(ctx, x, y, text, color) {
        // Button Hintergrund
        ctx.fillStyle = color;
        ctx.fillRect(x, y, this.buttonWidth, this.buttonHeight);
        
        // Button Rand
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, this.buttonWidth, this.buttonHeight);
        
        // Button Text
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x + this.buttonWidth / 2, y + this.buttonHeight / 2);
    }

    isButtonClicked(mouseX, mouseY, buttonX, buttonY) {
        return mouseX >= buttonX && 
               mouseX <= buttonX + this.buttonWidth && 
               mouseY >= buttonY && 
               mouseY <= buttonY + this.buttonHeight;
    }

    handleClick(mouseX, mouseY) {
        if (!this.visible) return;
        
        const imageY = (this.canvasHeight - this.imageHeight) / 2;
        const buttonY = imageY + this.imageHeight + 30;
        const totalButtonWidth = (this.buttonWidth * 2) + this.buttonSpacing;
        const startX = (this.canvasWidth - totalButtonWidth) / 2;
        const retryX = startX + this.buttonWidth + this.buttonSpacing;
        
        // Retry Button
        if (this.isButtonClicked(mouseX, mouseY, retryX, buttonY)) {
            this.retryGame();
        }
        
        // Main Menu Button (später implementieren)
        if (this.isButtonClicked(mouseX, mouseY, startX, buttonY)) {
            // TODO: Main Menu implementieren
        }
    }

    retryGame() {
        // Endscreen verstecken
        this.hide();
        
        // Spiel neu starten
        if (window.world) {
            window.world.restartGame();
        }
    }
}