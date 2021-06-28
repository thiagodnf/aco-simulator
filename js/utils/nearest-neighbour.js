class NearestNeighbour {

    static solve(environment) {

        let citiesToVisit = [];
        let solution = [];

        let currentCity = RandomUtils.nextInt(0, environment.getNumberOfNodes() - 1);

        for (let i = 0; i < environment.getNumberOfNodes(); i++) {
            if (i !== currentCity) {
                citiesToVisit.push(i);
            }
        }

        solution.push(currentCity);

        while (citiesToVisit.length !== 0) {

            let nextCity = -1;

            let minDistance = Number.MAX_VALUE;

            citiesToVisit.forEach(j => {

                let distance = environment.getDistance(currentCity, j);

                if (distance < minDistance) {
                    minDistance = distance;
                    nextCity = j;
                }
            });

            solution.push(nextCity);

            citiesToVisit.splice(citiesToVisit.indexOf(nextCity), 1);

            currentCity = nextCity;
        }

        solution.push(solution[0]); //Add the start city in the solution

        return solution;
    }
}
