class Statusbar extends DrawableObject {
    IMAGES_HEALTH = [
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png"
    ];

    IMAGES_COINS = [
        "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png",
        "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png",
        "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png",
        "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png",
        "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png",
        "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png"
    ];

    IMAGES_BOTTLE = [
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png",
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png",
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png",
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png"
    ];

    constructor(type = 'health') {
        super();
        this.type = type;
        this.percentage = 100;
        this.x = 0;
        this.y = -10;
        this.width = 200;
        this.height = 50;
        if (type === 'health') {
            this.loadImage(this.IMAGES_HEALTH[0]);
            this.loadImages(this.IMAGES_HEALTH);
        } else if (type === 'coins') {
            this.loadImage(this.IMAGES_COINS[0]);
            this.loadImages(this.IMAGES_COINS);
        } else if (type === 'bottle') {
            this.loadImage(this.IMAGES_BOTTLE[0]);
            this.loadImages(this.IMAGES_BOTTLE);
        }
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        if (this.type === 'health') {
            this.img = this.imageCache[this.IMAGES_HEALTH[this.resolveImageIndex()]];
        } else if (this.type === 'coins') {
            this.img = this.imageCache[this.IMAGES_COINS[this.resolveImageIndex()]];
        } else if (this.type === 'bottle') {
            this.img = this.imageCache[this.IMAGES_BOTTLE[this.resolveImageIndex()]];
        }
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