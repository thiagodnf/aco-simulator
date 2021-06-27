class AntSystem extends ACO {

    constructor(environment) {
        super(
            environment,
            new PseudoRandomProportional(environment, new RouletteWheel()),
        );

        this.evaporations.push(new FullEvaporation(environment));
        this.deposits.push(new FullDeposit(environment));
    }

    getT0() {

        let k = this.environment.getNumberOfAnts();
        let cnn = this.environment.cnn;

        return k / cnn;
    }
}
