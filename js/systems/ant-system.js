class AntSystem extends RandomSystem {

    constructor(canvas){
        super(canvas);
        this.exploration = new PseudoRandomProportionalRule(canvas);
        this.Q = 1.0;
    }

    getT0() {

     	let k = this.canvas.getNumberOfAnts();
        let cnn = this.canvas.cnn;

		return k / cnn;
	}

    getNextNodeId(ant){

        // Get the next node given the current node
        let nextNode = this.exploration.doExploration(ant, ant.currentNode.id);

        // console.log(ant.currentNode.id + " -> "+ nextNode)

        return nextNode;
    }

    runGlobalUpdateRule() {

        var RHO = 0.1;

        for (var i = 0; i < this.canvas.getNumberOfNodes(); i++) {
            for (var j = i; j < this.canvas.getNumberOfNodes(); j++) {
                if (i != j) {

                    // Do Evaporation
                    this.canvas.environment.setTau(i, j, this.evaporationGetTheNewValue(i, j));
                    this.canvas.environment.setTau(j, i, this.canvas.environment.getTau(i, j));

                    // Do Deposit
                    this.canvas.environment.setTau(i, j, this.depositGetTheNewValue(i, j));
                    this.canvas.environment.setTau(j, i, this.canvas.environment.getTau(i, j));
                }
            }
        }
    }

    evaporationGetTheNewValue(i, j){

        var RHO = 0.1;

        return (1.0 - RHO) * this.canvas.environment.getTau(i, j);
    }

    depositGetTheNewValue(i, j){

        var RHO = 0.1;

        return this.canvas.environment.getTau(i, j) + RHO * this.getDeltaTau(i, j);
    }

    getDeltaTau(i, j){

        let deltaTau = 0.0;

        this.canvas.ants.forEach(ant => {
			if (ant.getPath(i, j) == 1) {
				deltaTau += (this.Q / ant.tourDistance);
			}
		});

		return deltaTau;
    }
}
