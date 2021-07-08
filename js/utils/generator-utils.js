class GeneratorUtils {

    static circle(numberOfCircles) {

        let positions = [];

        let distance = FabricjsUtils.NODE_RADIUS * 5;

        for (let i = 1; i <= numberOfCircles; i++) {

            let radius = 45 + (i * distance);

            let angle = 360 / (10 * i);

            for (let a = 0; a < 360; a += angle) {
                positions.push({
                    x: (canvas.width / 2) + radius * Math.cos(a * (Math.PI / 180)),
                    y: (canvas.height / 2) + radius * Math.sin(a * (Math.PI / 180))
                });
            }
        }

        return positions;
    }
}
