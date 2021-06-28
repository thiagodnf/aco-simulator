class QSelection extends PseudoRandomProportional {

    constructor(environment, selection) {
        super(environment, selection);
    }

    getNextNode(ant, i) {
        if (RandomUtils.nextFloat(0.0, 1.0) <= this.environment.q0) {
            return this.doExploitation(ant, i);
        } else {
            return this.doExploration(ant, i);
        }
    }

    doExploitation(ant, i) {

        let nextNode = -1;

        let maxValue = Number.MIN_VALUE;

        // Update the sum
        ant.nodeIdsToVisit.forEach(j => {

            let tij = this.environment.getTau(i, j);
            let nij = Math.pow(this.environment.getNij(i, j), this.environment.beta)
            let value = tij * nij;

            if (value > maxValue) {
                maxValue = value;
                nextNode = j;
            }
        });

        if (nextNode == -1) {
            throw new Error("The next node should not be -1");
        }

        return nextNode;
    }
}
