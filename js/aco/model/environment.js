class Environment {

    constructor(canvas) {
        this.bestTourDistance;
        this.bestTour;
        this.tau = {};
        this.canvas = canvas;

        this.nodes = [];
        this.ants = [];
        this.alpha = 1.0;
        this.beta = 1.0;

        this.reset();
    }

    getNumberOfAnts() {
        return this.ants.length;
    }

    getNumberOfNodes() {
        return this.nodes.length;
    }

    getAlpha() {
        return this.alpha;
    }

    getBeta() {
        return this.beta;
    }

    reset() {

        this.tau = {};
        this.bestTour = [];
        this.bestTourDistance = Number.NaN;

        for (let i = 0; i < this.getNumberOfNodes(); i++) {
            for (let j = i + 1; j < this.getNumberOfNodes(); j++) {
                this.setTau(i, j, this.getT0());
            }
        }
    }

    getT0() {

        let k = this.getNumberOfAnts();
        let cnn = this.canvas.cnn;

        return k / cnn;
    }

    setBestAnt() {

        let bestAnt = this.ants.reduce(function (p, v) {
            return (p.tourDistance < v.tourDistance ? p : v);
        });

        if (Number.isNaN(this.bestTourDistance) || bestAnt.tourDistance < this.bestTourDistance) {
            this.bestTour = bestAnt.visitedNodeIds;
            this.bestTourDistance = bestAnt.tourDistance;
        }
    }

    findNodeById(nodeId) {
        return this.nodes.filter(n => n.id == nodeId)[0];
    }

    getNij(i, j) {
        return 1.0 / this.getTourDistance(i, j);
    }

    getTourDistance(i, j) {
        return FabricjsUtils.getEuclideanDistance(this.findNodeById(i), this.findNodeById(j));
    }

    getTau(i, j) {
        if (i < j) {
            return this.tau[i + "_" + j];
        } else {
            return this.tau[j + "_" + i];
        }
    }

    setTau(i, j, value) {
        if (i < j) {
            this.tau[i + "_" + j] = value;
        } else {
            this.tau[j + "_" + i] = value;
        }
    }
}
