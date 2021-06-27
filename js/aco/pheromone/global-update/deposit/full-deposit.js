class FullDeposit extends GlobalUpdate {

    constructor(environment) {
        super(environment);
    }

    getTheNewValue(i, j) {
        return this.environment.getTau(i, j) + this.environment.rho * this.getDeltaTau(i, j);
	}

    getDeltaTau(i, j) {

		let deltaTau = 0.0;

        this.environment.ants.forEach(ant => {
            if (ant.path[i][j] == 1) {
				deltaTau += 1.0 / ant.tourDistance;
			}
        });

		return deltaTau;
	}
}
