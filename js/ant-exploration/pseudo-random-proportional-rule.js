class PseudoRandomProportionalRule{

    constructor(canvas){
        this.canvas = canvas;
        this.selection = new RouletteWheel();
    }

    doExploration(ant, i) {

        let nextNode = -1;

		let sum = 0.0;

		let tij = new Array(this.canvas.getNumberOfNodes()).fill(0);
		let nij = new Array(this.canvas.getNumberOfNodes()).fill(0);

        ant.nodesToVisit.forEach(node => {

            let j = node.id;

			tij[j] = Math.pow(this.canvas.environment.getTau(i, j), this.canvas.getAlpha());
			nij[j] = Math.pow(this.canvas.getNij(i, j), this.canvas.getBeta());

			sum += tij[j] * nij[j];
		});

		//checkState(sum != 0.0, "The sum cannot be 0.0");

		let probability = new Array(this.canvas.getNumberOfNodes()).fill(0);

		ant.nodesToVisit.forEach(node => {

            let j = node.id;

			probability[j] = (tij[j] * nij[j]) / sum;
		});

        // Select the next node by probability
		nextNode = this.selection.select(probability);

        if(nextNode == -1){
            console.log("The next node should not be -1")
        }

		return nextNode;
	}
}
