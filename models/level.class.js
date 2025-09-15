class Level {
    chickens;
    clouds;
    background;
    coins;
    bottles;

    /**
     * Creates a new Level instance containing all game objects
     * @param {Array} chickens - Array of chicken enemies
     * @param {Array} clouds - Array of cloud objects
     * @param {Array} background - Array of background elements
     * @param {Array} coins - Array of collectible coins
     * @param {Array} bottles - Array of collectible bottles
     */
    constructor(chickens, clouds, background, coins, bottles) {
        this.chickens = chickens;
        this.clouds = clouds;
        this.background = background;
        this.coins = coins;
        this.bottles = bottles;
    }
}