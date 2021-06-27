class Environment {

    constructor(aco) {

        this.aco = aco;

        this.bestTour = [];
        this.bestTourDistance = Number.NaN;

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

        this.ants.map(ant => ant.tourDistance = that.evaluate(ant.visitedNodeIds));

        let bestAnt = this.ants.reduce(function (p, v) {
            return (p.tourDistance < v.tourDistance ? p : v);
        });

        if (Number.isNaN(this.bestTourDistance) || bestAnt.tourDistance < this.bestTourDistance) {
            this.bestTour = bestAnt.visitedNodeIds;
            this.bestTourDistance = bestAnt.tourDistance;
        }
    }

    upateCnn() {
        this.cnn = this.evaluate(NearestNeighbour.solve(this));
    }

    updateAnts(){
        this.ants.forEach(ant => {
            ant.path = ArrayUtils.newMatrix(this.getNumberOfNodes(), this.getNumberOfNodes(), 0);
        });
    }

    getNumberOfAnts() {
        return this.ants.length;
    }

    getNumberOfNodes() {
        return this.nodes.length;
    }

    addNode(node){

        this.bestTour = [];
        this.bestTourDistance = Number.NaN;

        this.nodes.push(node);
        this.updateDistances();
        this.upateCnn();
        this.updateAnts();
    }

    isGenerationDone(){
        return this.ants.map(e => e.isGenerationDone()).reduce((acc, v) => acc && v);
    }

    addAnt(ant){
        this.ants.push(ant);
    }

    evaluate(array) {

        let total = 0.0;

        for (let i = 0; i < array.length - 1; i++) {
            total += this.getDistance(array[i], array[i + 1]);
        }

        return total;
    }

    findNodeById(nodeId) {
        return this.nodes.filter(n => n.id == nodeId)[0];
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
