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

    static square(numberOfSquare) {

        let positions = [];

        for (let i = 1; i <= numberOfSquare; i++) {

            let radius = 0 + (75 * i);
            let centerX = canvas.width / 2;
            let centerY = canvas.height / 2;

            let d1 = { x: centerX - radius, y: centerY - radius };
            let d2 = { x: centerX + radius, y: centerY - radius };
            let d3 = { x: centerX - radius, y: centerY + radius };
            let d4 = { x: centerX + radius, y: centerY + radius };

            positions = [...positions, ...[d1, d2, d3, d4]]
            positions = [...positions, ...GeneratorUtils.points(d1, d2, 3 * i)]
            positions = [...positions, ...GeneratorUtils.points(d1, d3, 3 * i)]
            positions = [...positions, ...GeneratorUtils.points(d3, d4, 3 * i)]
            positions = [...positions, ...GeneratorUtils.points(d2, d4, 3 * i)]
        }

        return positions;
    }

    static points(p1, p2, div) {

        let distX = (p1.x - p2.x) / div;
        let distY = (p1.y - p2.y) / div;

        let points = [];

        if (p1.y == p2.y) {
            for (let i = 1; i <= div - 1; i++) {
                points.push({
                    x: p1.x - distX * i,
                    y: p1.y
                });
            }
        }
        if (p1.x == p2.x) {
            for (let i = 1; i <= div - 1; i++) {
                points.push({
                    x: p1.x,
                    y: p1.y - distY * i
                });
            }
        }

        return points;
    }

}
