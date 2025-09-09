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
    }
}