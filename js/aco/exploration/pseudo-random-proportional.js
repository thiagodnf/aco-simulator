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

        ant.nodesToVisit.forEach(node => {

            let j = node.id;

            tij[j] = Math.pow(this.canvas.environment.getTau(i, j), this.canvas.getAlpha());
            nij[j] = Math.pow(this.canvas.environment.getNij(i, j), this.canvas.getBeta());

            sum += tij[j] * nij[j];
        });

        if (sum == 0.0) {
            console.log(tij);
            console.log(nij);
            console.log(ant.visitedNodes.map(e => e.id));
            console.log(ant.nodesToVisit.map(e => e.id));
            console.log(this.canvas.environment.tau)
            console.log(ant.currentNode.id)
            throw new Error("The sum cannot be 0.0");
        }

        let probability = new Array(this.canvas.getNumberOfNodes()).fill(0);

        ant.nodesToVisit.forEach(node => {

            let j = node.id;

            probability[j] = (tij[j] * nij[j]) / sum;
        });

        nextNode = this.selection.doSelection(probability);

        if (nextNode == -1) {
            throw new Error("The next node should not be -1");
        }

        return nextNode;
    }
}
