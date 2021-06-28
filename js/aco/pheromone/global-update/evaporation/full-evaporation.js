class FullEvaporation extends GlobalUpdate {

    constructor(environment) {
        super(environment);
    }

    getTheNewValue(i, j) {
        return (1.0 - this.environment.rho) * this.environment.getTau(i, j);
	}
}
