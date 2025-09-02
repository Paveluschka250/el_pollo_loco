class Statusbar extends DrawableObject {
    IMAGES_HEALTH = [
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png"
    ];

    constructor() {
        super();
        this.loadImage("assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png");
        this.loadImages(this.IMAGES_HEALTH);
        this.x = 0;
        this.y = -10;
        this.width = 200;
        this.height = 50;
        this.percentage = 100;
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        this.img = this.imageCache[this.IMAGES_HEALTH[this.resolveImageIndex()]];
    }

    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage == 80) {
            return 4;
        } else if (this.percentage == 60) {
            return 3;
        } else if (this.percentage == 40) {
            return 2;
        } else if (this.percentage == 20) {
            return 1;
        } else {
            return 0;
        }
    }
}