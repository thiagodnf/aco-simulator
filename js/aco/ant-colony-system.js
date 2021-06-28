class AntColonySystem extends ACO {

    constructor(environment) {
        super(
            environment,
            new QSelection(environment, new RouletteWheel()),
        );

        this.localUpdating = new ACSLocalUpdate(environment, this);

        this.evaporations.push(new FullEvaporation(environment));
        this.deposits.push(new PartialDeposit(environment, new GlobalBest()));
    }

    getT0() {

        let n = this.environment.getNumberOfNodes();
        let cnn = this.environment.cnn;

        return 1.0 / (n * cnn);
    }
}
