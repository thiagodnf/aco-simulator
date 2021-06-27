class PseudoRandomProportional extends AntExploration {

    constructor(canvas, selection) {
        super();
        this.canvas = canvas;
        this.selection = selection;
    }

    doExploration(ant, i) {

        let nextNode = -1;

        let sum = 0.0;

        let tij = new Array(this.canvas.getNumberOfNodes()).fill(0);
        let nij = new Array(this.canvas.getNumberOfNodes()).fill(0);

        ant.nodeIdsToVisit.forEach(j => {

            tij[j] = Math.pow(this.canvas.environment.getTau(i, j), this.canvas.getAlpha());
            nij[j] = Math.pow(this.canvas.environment.getNij(i, j), this.canvas.getBeta());

            sum += tij[j] * nij[j];
        });

        let probability = new Array(this.canvas.getNumberOfNodes()).fill(0);

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
