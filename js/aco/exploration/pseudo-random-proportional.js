class PseudoRandomProportional extends AntExploration {

    constructor(environment, selection) {
        super();
        this.environment = environment;
        this.selection = selection;
    }

    getNextNode(ant, i) {
		return this.doExploration(ant, i);
	}

    doExploration(ant, i) {

        let nextNode = -1;

        let sum = 0.0;

        let tij = new Array(this.environment.getNumberOfNodes()).fill(0);
        let nij = new Array(this.environment.getNumberOfNodes()).fill(0);

        ant.nodeIdsToVisit.forEach(j => {

            tij[j] = Math.pow(this.environment.getTau(i, j), this.environment.alpha);
            nij[j] = Math.pow(this.environment.getNij(i, j), this.environment.beta);

            sum += tij[j] * nij[j];
        });

        let probability = new Array(this.environment.getNumberOfNodes()).fill(0);

        let sumProbability = 0.0;

        ant.nodeIdsToVisit.forEach(j => {
            probability[j] = (tij[j] * nij[j]) / sum;
            sumProbability += probability[j];
        });

        nextNode = this.selection.doSelection(probability, sumProbability);

        if (nextNode == -1) {
            throw new Error("The next node should not be -1");
        }

        return nextNode;
    }
}
