class Environment {

    constructor(aco) {

        this.aco = aco;

        this.bestTour = [];
        this.bestPath = [];
        this.bestTourDistance = Number.NaN;
        this.averageTourDistance = Number.NaN;

        this.tau = [];
        this.distances = [];

        this.nodes = [];
        this.ants = [];

        this.cnn = 1.0;
        this.alpha = 1.0;
        this.beta = 2.0;
        this.rho = 0.1;

        this.omega = 0.1;
        this.q0 = 0.9;
    }

    init(){
        console.log("init")

        this.bestTour = [];
        this.bestTourDistance = Number.NaN;
        this.averageTourDistance = Number.NaN;

        this.updateDistances();
        this.upateCnn();
    }

    updateDistances(){

        let size = this.getNumberOfNodes();

        this.distances = ArrayUtils.newMatrix(size, size, 0);

        for (let i = 0; i < size; i++) {

            for (let j = i + 1; j < size; j++) {

                let ni = this.findNodeById(i);
                let nj = this.findNodeById(j);

                this.distances[i][j] = this.distances[j][i] = FabricjsUtils.getEuclideanDistance(ni, nj);
            }
        }
    }

    updateBestTour() {

        let that = this;

        this.averageTourDistance = 0.0;

        let bestAnt = null;

        this.ants.forEach(ant => {

            that.averageTourDistance += ant.tourDistance;

            if (bestAnt == null || ant.tourDistance < bestAnt.tourDistance) {
                bestAnt = ant;
            }
        });

        this.averageTourDistance /= that.getNumberOfAnts();

        if (Number.isNaN(this.bestTourDistance) || bestAnt.tourDistance < this.bestTourDistance) {
            this.bestTour = bestAnt.visitedNodeIds;
            this.bestTourDistance = bestAnt.tourDistance;
            this.bestPath = bestAnt.path;
        }
    }

    upateCnn() {
        this.cnn = this.evaluate(NearestNeighbour.solve(this));
    }

    getNumberOfAnts() {
        return this.ants.length;
    }

    getNumberOfNodes() {
        return this.nodes.length;
    }

    addNode(node){
        this.nodes.push(node);
    }

    isGenerationDone(){
        return this.ants.map(e => e.isGenerationDone()).reduce((acc, v) => acc && v);
    }

    addAnt(ant){
        this.ants.push(ant);
    }

    evaluate(array) {

        if (array.length <= 1) {
            return Number.MAX_VALUE;
        }

        let total = 0.0;

        for (let i = 0; i < array.length - 1; i++) {
            total += this.getDistance(array[i], array[i + 1]);
        }

        return total;
    }

    findNodeById(nodeId) {
        return this.nodes[nodeId];
    }

    getNij(i, j) {
        return 1.0 / this.getDistance(i, j);
    }

    getDistance(i, j) {
        return this.distances[i][j];
    }

    setTau(i, j, value) {
        return this.tau[i][j] = value
    }

    getTau(i, j) {
        return this.tau[i][j];
    }
}
