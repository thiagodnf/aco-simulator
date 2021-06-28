class ACSLocalUpdate {

    constructor(environment, aco) {
        this.environment = environment;
        this.aco = aco;
    }

    execute(i, j) {

        let rate = this.environment.omega;

        let evaporation = (1.0 - rate) * this.environment.getTau(i, j);
        let deposition = rate * this.aco.getT0();

        this.environment.setTau(i, j, evaporation + deposition);
        this.environment.setTau(j, i, evaporation + deposition);
    }
}
