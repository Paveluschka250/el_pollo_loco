const level = new Level(
    [
        // new Endboss(), new Chicken(), new Chicken(), new Chicken(),
    ],
    [
        new Cloud(0, 500, "assets/img/5_background/layers/4_clouds/1.png"),
        new Cloud(600, 1000, "assets/img/5_background/layers/4_clouds/2.png"),
        new Cloud(1200, 1600, "assets/img/5_background/layers/4_clouds/1.png"),
        new Cloud(1800, 2200, "assets/img/5_background/layers/4_clouds/2.png"),
        new Cloud(2400, 2800, "assets/img/5_background/layers/4_clouds/1.png"),
    ],
    [
        new Background("assets/img/5_background/layers/air.png", -720),
        new Background("assets/img/5_background/layers/3_third_layer/2.png", -720),
        new Background("assets/img/5_background/layers/2_second_layer/2.png", -720),
        new Background("assets/img/5_background/layers/1_first_layer/2.png", -720),
        new Background("assets/img/5_background/layers/air.png", 0),
        new Background("assets/img/5_background/layers/3_third_layer/1.png", 0),
        new Background("assets/img/5_background/layers/2_second_layer/1.png", 0),
        new Background("assets/img/5_background/layers/1_first_layer/1.png", 0),
        new Background("assets/img/5_background/layers/air.png", 720),
        new Background("assets/img/5_background/layers/3_third_layer/2.png", 720),
        new Background("assets/img/5_background/layers/2_second_layer/2.png", 720),
        new Background("assets/img/5_background/layers/1_first_layer/2.png", 720),
        new Background("assets/img/5_background/layers/air.png", 720 * 2),
        new Background("assets/img/5_background/layers/3_third_layer/1.png", 720 * 2),
        new Background("assets/img/5_background/layers/2_second_layer/1.png", 720 * 2),
        new Background("assets/img/5_background/layers/1_first_layer/1.png", 720 * 2),
        new Background("assets/img/5_background/layers/air.png", 720 * 3),
        new Background("assets/img/5_background/layers/3_third_layer/2.png", 720 * 3),
        new Background("assets/img/5_background/layers/2_second_layer/2.png", 720 * 3),
        new Background("assets/img/5_background/layers/1_first_layer/2.png", 720 * 3),
    ],
    [
        new Coin(-500, -100),
        new Coin(200, 500),
        new Coin(700, 1000),
        new Coin(1200, 1500),
        new Coin(1800, 2100)
    ],
    [
        new Bottle(-500, -100, "assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png"),
        new Bottle(200, 500, "assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png"),
        new Bottle(500, 1000, "assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png"),
        new Bottle(1000, 1500, "assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png"),
        new Bottle(1500, 2000, "assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png")
    ]
);