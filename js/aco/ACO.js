class ACO {

    constructor(environment) {

        this.environment = environment;

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

    getT0() {
        throw new Error("Method 'getT0' must be implemented.");
    }
}
