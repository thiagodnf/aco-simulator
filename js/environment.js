class Environment {

    constructor(canvas) {
        this.bestTourDistance;
        this.bestTour;
        this.tau = {};
        this.canvas = canvas;
        this.reset();
    }

    reset() {
        this.tau = {};
        this.bestTour = [];
        this.bestTourDistance = Number.NaN;

        for (let i = 0; i < this.canvas.nodes.length; i++) {
            for (let j = i + 1; j < this.canvas.nodes.length; j++) {
                this.setTau(i, j, this.canvas.aco.getT0());
            }
        }
    }

    setBestAnt(ants) {

        let bestAnt = ants.reduce(function (p, v) {
            return (p.tourDistance < v.tourDistance ? p : v);
        });

        if (Number.isNaN(this.bestTourDistance) || bestAnt.tourDistance < this.bestTourDistance) {
            this.bestTour = bestAnt.visitedNodeIds;
            this.bestTourDistance = bestAnt.tourDistance;
        }
    }

    getNij(i, j) {
        return 1.0 / this.getTourDistance(i, j);
    }

    getTourDistance(i, j) {
        return FabricjsUtils.getEuclideanDistance(this.canvas.findNodeById(i), this.canvas.findNodeById(j));
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
