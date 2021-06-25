class Environment {

    constructor(canvas) {
        this.bestTourDistance;
        this.bestTour;
        this.generation;
        this.antsWithTheirTourDone;
        this.tau = {};
        this.canvas = canvas;
        this.events = new utils.Events();
        this.reset();
    }

    on(eventName, callback) {
        this.events.on(eventName, callback);
    }

    reset() {
        this.tau = {};
        this.generation = 0;
        this.antsWithTheirTourDone = [];
        this.bestTour = [];
        this.bestTourDistance = Number.NaN;

        for (let i = 0; i < this.canvas.nodes.length; i++) {
            for (let j = i + 1; j < this.canvas.nodes.length; j++) {
                this.setTau(i, j, this.canvas.system.getT0());
            }
        }

        //this.canvas.updateGeneration(this.generation, this.bestTour, this.bestTourDistance);
    }

    setTourDone(ant) {

        this.antsWithTheirTourDone.push(ant);

        if (this.isGenerationDone()) {

            let bestAnt = this.antsWithTheirTourDone.reduce(function (p, v) {
                return (p.tourDistance < v.tourDistance ? p : v);
            });

            if (Number.isNaN(this.bestTourDistance) || bestAnt.tourDistance < this.bestTourDistance) {
                this.bestTour = bestAnt.visitedNodes;
                this.bestTourDistance = bestAnt.tourDistance;
            }

            this.generation++;
            this.antsWithTheirTourDone = [];

            this.canvas.updateGeneration(this.generation, this.bestTour, this.bestTourDistance);
        }
    }

    isGenerationDone() {
        return this.antsWithTheirTourDone.length == this.canvas.ants.length;
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
