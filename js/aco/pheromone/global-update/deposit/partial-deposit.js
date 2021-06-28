class PartialDeposit extends GlobalUpdate {

    constructor(environment, subset) {
        super(environment);

         this.subset = subset
    }

    getTheNewValue(i, j) {
        return this.environment.getTau(i, j) + this.environment.rho * this.getDeltaTau(i, j);
	}

    getDeltaTau(i, j) {

		let deltaTau = 0.0;

        let subset = this.subset.select(this.environment);

        subset.forEach(ant => {
            if (ant.path[i][j] == 1) {
				deltaTau += 1.0 / ant.tourDistance;
			}
        });

		return deltaTau;
	}
}
