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

    static nextFloat(min, max, fixed = 8) {
        return RandomUtils.chance.floating({ min: min, max: max, fixed: fixed });
    }

    static nextNodes(numberOfNodes, width, height) {

        let nodes = [];

        for (var i = 0; i < numberOfNodes; i++) {

            let x = RandomUtils.nextInt(FabricjsUtils.NODE_RADIUS * 2, width - FabricjsUtils.NODE_RADIUS * 2);
            let y = RandomUtils.nextInt(FabricjsUtils.NODE_RADIUS * 2, height - FabricjsUtils.NODE_RADIUS * 2);

            nodes.push([x, y]);
        }

        return nodes;
    }
}
