class AntSystem extends ACO {

    constructor(environment) {
        super(environment);
        this.exploration = new PseudoRandomProportional(environment, new RouletteWheel());
        this.Q = 1.0;
    }


    getT0() {

        let k = this.environment.getNumberOfAnts();
        let cnn = this.environment.cnn;

        return k / cnn;
    }

    getNextNodeId(ant) {
        return this.exploration.doExploration(ant, ant.currentNodeId);
    }

    runGlobalUpdateRule() {

        var RHO = 0.1;

        for (var i = 0; i < this.environment.getNumberOfNodes(); i++) {
            for (var j = i; j < this.environment.getNumberOfNodes(); j++) {
                if (i != j) {

                    // Do Evaporation
                    this.environment.setTau(i, j, this.evaporationGetTheNewValue(i, j));
                    this.environment.setTau(j, i, this.environment.getTau(i, j));

                    // // Do Deposit
                    this.environment.setTau(i, j, this.depositGetTheNewValue(i, j));
                    this.environment.setTau(j, i, this.environment.getTau(i, j));
                }
            }
        }
    }

    evaporationGetTheNewValue(i, j) {

        var RHO = 0.1;

        return (1.0 - RHO) * this.environment.getTau(i, j);
    }

    depositGetTheNewValue(i, j) {

        var RHO = 0.1;

        return this.environment.getTau(i, j) + RHO * this.getDeltaTau(i, j);
    }

    getDeltaTau(i, j) {

        let Q = 1.0;

        let deltaTau = 0.0;

        this.environment.ants.forEach(ant => {
            if (ant.getPath(i, j) == 1) {
                deltaTau += (Q / ant.tourDistance);
            }
        });

        return deltaTau;
    }
}
