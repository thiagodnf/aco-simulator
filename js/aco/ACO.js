class ACO {

    constructor(environment, exploration) {

        this.environment = environment;
        this.exploration = exploration;
        this.evaporations = [];
        this.deposits = [];

        if (this.constructor == ACO) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    initializeTau(){

        let size = this.environment.getNumberOfNodes();

        this.environment.tau = ArrayUtils.newMatrix(size, size, 0);

        for (let i = 0; i < size; i++) {
            for (let j = i + 1; j < size; j++) {
                this.environment.tau[i][j] = this.environment.tau[j][i] = this.getT0();
            }
        }
    }

    runGlobalPheromoneUpdate() {

        let that = this;

        for (var i = 0; i < this.environment.getNumberOfNodes(); i++) {
            for (var j = i+1; j < this.environment.getNumberOfNodes(); j++) {

                // Do Evaporation
                this.evaporations.forEach(evaporation => {
                    that.environment.setTau(i, j, evaporation.getTheNewValue(i, j));
                    that.environment.setTau(j, i, that.environment.getTau(i, j));
                });

                // Do Deposit
                this.deposits.forEach(deposit => {
                    that.environment.setTau(i, j, deposit.getTheNewValue(i, j));
                    that.environment.setTau(j, i, that.environment.getTau(i, j));
                });
            }
        }
    }

    getNextNode(ant){
        let nextNodeId = this.exploration.doExploration(ant, ant.currentNodeId);
        return this.environment.findNodeById(nextNodeId);
    }

    getT0() {
        throw new Error("Method 'getT0' must be implemented.");
    }
}
