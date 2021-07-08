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

        let distance = FabricjsUtils.NODE_RADIUS * 2;

        for (let i = 1; i <= numberOfSquare; i++) {

            let radius = 30 + (i * distance);
            let angle = Math.tan(45 * (Math.PI / 180));
            let centerX = canvas.width/2;
            let centerY = canvas.height/2;

            let center = {
                x: centerX,
                y: centerY
            };

            positions.push(center);

            for (let j = 0; j <= 45; j += 5) {
                positions.push({
                    x: centerX - radius / Math.sin(j * (Math.PI / 180)),
                    y: centerY
                });
            }

            // positions.push({
            //     x: centerX,
            //     y: centerY
            // });
            // for (let j = 1; j <= 2; j++) {
            //     positions.push({
            //         x: centerX + radius*j,
            //         y: centerY
            //     });
            // }
            // for (let j = 1; j <= 2; j++) {
            //     positions.push({
            //         x: centerX,
            //         y: centerY + radius*j,
            //     });
            // }
            // positions.push({
            //     x: centerX + radius,
            //     y: centerY + radius
            // });

            // positions.push({
            //     x: centerX,
            //     y: centerY-radius
            // });

            // for (let j = 1; j <= 2; j++) {
            //     positions.push({
            //         x: centerX + radius * j,
            //         y: centerY
            //     });
            //     positions.push({
            //         x: centerX,
            //         y: centerY + radius * j
            //     });
            // }

            // centerX = centerX + radius * 2;
            // centerY = centerY + radius * 2;

            // positions.push({
            //     x: centerX,
            //     y: centerY
            // });

            // for (let j = 1; j <= 2; j++) {
            //     positions.push({
            //         x: centerX - radius * j,
            //         y: centerY
            //     });
            //     positions.push({
            //         x: centerX,
            //         y: centerY - radius * j
            //     });
            // }

            // positions = [...positions, ...GeneratorUtils.points(d1,d2) ]
        }

        return positions;
    }

    static points(p1, p2) {

        let distX = p1.x = p2.x;
        let distY = p1.y = p2.y;


        return [];
    }

}
