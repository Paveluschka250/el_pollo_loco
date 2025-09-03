const level = new Level(
    [
        new Endboss(), new Chicken(), new Chicken(), new Chicken(),
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
    ]
);