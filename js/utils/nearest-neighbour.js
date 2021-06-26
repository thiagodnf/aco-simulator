class NearestNeighbour {

    static solve(p) {

        let citiesToVisit = [];
        let solution = [];

        let currentCity = RandomUtils.nextInt(0, p.getNumberOfNodes() - 1);

        for (let i = 0; i < p.getNumberOfNodes(); i++) {
            if (i != currentCity) {
                citiesToVisit.push(i);
            }
        }

        solution.push(currentCity);

        while (citiesToVisit.length !== 0) {

            let nextCity = -1;

            let minDistance = Number.MAX_VALUE;

            citiesToVisit.forEach(j => {

                let distance = p.environment.getTourDistance(currentCity, j);

                if (distance < minDistance) {
                    minDistance = distance;
                    nextCity = j;
                }
            });

            solution.push(nextCity);

            citiesToVisit.splice(citiesToVisit.indexOf(nextCity), 1);

            currentCity = nextCity;
        }

        //Add the start city in the solution
        solution.push(solution[0]);

        return solution;
    }
}
