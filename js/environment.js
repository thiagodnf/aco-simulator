class Environment{

    constructor(canvas){
        this.bestAnt;
        this.bestValue;
        this.generation = 0;
        this.numberOfDoneAnts = 0;
        this.canvas = canvas;
        this.events = new utils.Events();
        this.reset();
    }

    on(eventName, callback) {
        this.events.on(eventName, callback);
    }

    reset(){
        this.bestAnt = null;
        this.bestValue = Number.MAX_SAFE_INTEGER;
        this.canvas.updateBestAnt(this.bestAnt, this.bestValue);
    }

    updateBestAnt(ant) {

        let value = this.calculateValue(ant.visitedNodes);

        if (value < this.bestValue) {
            this.bestAnt = ant;
            this.bestValue = value;
            this.canvas.updateBestAnt(this.bestAnt, this.bestValue);
        }

        this.numberOfDoneAnts++;

        let generation = Math.round(this.numberOfDoneAnts / this.canvas.nodes.length);

        if(generation != this.generation){
            this.generation = generation;
            this.canvas.updateGeneration(this.generation, this.bestValue);
        }
    }

    calculateValue(visitedNodes) {

        let totalDistance = 0.0;

        for (var i = 0; i < visitedNodes.length - 1; i++) {
            totalDistance += FabricjsUtils.getEuclideanDistance(visitedNodes[i], visitedNodes[i + 1]);
        }

        return totalDistance;
    }
}
