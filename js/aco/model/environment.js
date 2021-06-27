class Environment {

    constructor(aco) {

        this.aco = aco;

        this.bestTour;
        this.bestTourDistance;

        this.tau = [];
        this.distances = [];


        this.nodes = [];
        this.ants = [];

        this.cnn = 1.0;
        this.alpha = 1.0;
        this.beta = 2.0;

        this.reset();
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

    upateCnn() {

        let tour = NearestNeighbour.solve(this);

        this.cnn = this.evaluate(tour);
        console.log(tour)
        console.log(this.cnn)
        // let nodes = tour.map(e => this.environment.findNodeById(e));

        // this.cnn = FabricjsUtils.getEuclideanDistanceFromArray(nodes)
    }

    getNumberOfAnts() {
        return this.ants.length;
    }

    getNumberOfNodes() {
        return this.nodes.length;
    }

    addNode(node){
        this.nodes.push(node);
        this.updateDistances();
        this.upateCnn();
        this.reset();
    }

    addAnt(ant){
        this.ants.push(ant);
    }

    reset() {
        this.bestTour = [];
        this.bestTourDistance = Number.NaN;
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

    getTau(i, j) {
        return this.tau[i, j];
    }

    setTau(i, j, value) {
        return this.tau[i, j] = value
    }
}
