class RandomUtils {

    static chance = new Chance();

    static setSeed(seed) {
        if (seed) {
            RandomUtils.chance = new Chance(seed);
        } else {
            RandomUtils.chance = new Chance();
        }
    }

    static nextInt(min, max) {
        return RandomUtils.chance.integer({ min: min, max: max })
    }

    static nextFloat(min, max){
        return RandomUtils.chance.floating({ min: min, max: max });
    }
}
