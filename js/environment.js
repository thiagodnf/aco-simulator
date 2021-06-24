class Environment {

    constructor(canvas) {
        this.bestTourDistance;
        this.bestTour;
        this.generation;
        this.antsWithTheirTourDone;
        this.canvas = canvas;
        this.events = new utils.Events();
        this.reset();
    }

    on(eventName, callback) {
        this.events.on(eventName, callback);
    }

    reset() {
        this.generation = 0;
        this.antsWithTheirTourDone = [];
        this.bestTour = [];
        this.bestTourDistance = Number.NaN;
        this.canvas.updateGeneration(this.generation, this.bestTour, this.bestTourDistance);
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
}
