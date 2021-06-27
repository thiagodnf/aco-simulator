var OPTIONS = {
    ADD_NODE: 1,
    MOVE_NODE: 2,
};

class Canvas extends fabric.Canvas {

    constructor() {
        super('canvas', {
            selection: false,
            defaultCursor: 'crosshair',
        });

        // Default Settings
        this.nodesLimit = 50;
        this.showGrid = false;
        this.showPheromones = false;

        this.antSpeed = 80;
        this.animation = null;
        this.isRunning = false;
        this.isPlay = false;

        this.grid = null;
        this.bestSolution = null;
        this.generation = 0;

        // this.nodes = [];
        // this.ants = [];
        this.pheromones = [];
        this.cnn = 1.0;
        this.selectedOption;
        this.index = null;

        this.on('mouse:up', (event) => this.onMoveUp(event))

        this.environment = new Environment(this);
        this.aco = new AntSystem(this.environment);
    }

    onMoveUp(event) {
        if (this.selectedOption == OPTIONS.ADD_NODE) {
            this.addNode(event.pointer);
        }
    }

    resize(width, height) {
        this.setDimensions({ width: width, height: height });
        this.calcOffset();
        this.updateGrid();
    }

    addNode(pos) {

        if (this.isRunning) {
            return;
        }

        if (this.environment.getNumberOfNodes() >= this.nodesLimit) {
            return;
        }

        var node = new aco.Node(pos.x, pos.y);
        var ant = FabricjsUtils.makeAnt(node);

        this.environment.nodes.push(node)
        this.add(node);

        // if (this.ants.length <= 0) {
            this.environment.ants.push(ant);
            this.add(ant);
        // }

        this.environment.reset();

        this.updatePheromones();
        this.upateCnn();

        this.sortCanvas();
        this.fire('addedNode', [node]);
    }

    sortCanvas() {
        this._objects.sort((a, b) => (a.layer > b.layer) ? 1 : -1);
        this.renderAll();
    }

    outEdges(id) {

        var selected = [];

        this.edges.forEach(function (edge) {
            if (edge.source.id == id) {
                selected.push(edge);
            } else if (edge.target.id == id) {
                selected.push(edge);
            }
        });

        return selected;
    }

    upateCnn() {

        let tour = NearestNeighbour.solve(this.environment);
        let nodes = tour.map(e => this.environment.findNodeById(e));

        this.cnn = FabricjsUtils.getEuclideanDistanceFromArray(nodes)
    }

    replace(oldEl, newEl) {
        if (visible) {
            this.add(el);
        } else {
            this.remove(el);
        }
        this.sortCanvas();
    }

    setVisible(el, visible) {
        if (visible) {
            this.add(el);
        } else {
            this.remove(el);
        }
        this.sortCanvas();
    }

    updateGrid() {
        this.remove(this.grid);
        this.grid = FabricjsUtils.makeGrid(this.width, this.height);

        if (this.showGrid) {
            this.add(this.grid);
        }

        this.sortCanvas();
    }

    updatePheromones() {
        this.remove(this.pheromones);
        this.pheromones = FabricjsUtils.makeEdges(this.environment.nodes, this.environment);

        if (this.showPheromones) {
            this.add(this.pheromones);
        }

        this.sortCanvas();
    }

    toggleShowGrid() {

        this.showGrid = !this.showGrid;

        this.updateGrid();
    }

    toggleShowPheromones() {

        this.showPheromones = !this.showPheromones;

        this.updatePheromones();
    }

    setAddNode() {
        this.defaultCursor = 'crosshair';
        this.selectedOption = OPTIONS.ADD_NODE;
        this.lockCanvas(true);
    }

    setMoveNode() {
        this.defaultCursor = 'default';
        this.selectedOption = OPTIONS.MOVE_NODE;
        this.lockCanvas(false);
    }

    removeNode(ant) {

        this.remove(ant);
        this.remove(ant.currentNode);

        this.ants = this.ants.filter((n, i) => i !== this.ants.indexOf(ant));
        this.nodes = this.nodes.filter((n, i) => i !== this.nodes.indexOf(ant.currentNode));

        this.upateCnn();
    }

    removeSelectedNodes() {
        this.getActiveObjects().forEach((node) => {
            this.removeNode(node)
        });
        this.discardActiveObject().renderAll();
    }

    setAntSpeed(value) {
        this.antSpeed = value;
    }

    setClearAll() {
        this.clear()
        this.nodes = [];
        this.ants = [];
    }

    lockCanvas(lock) {
        this.environment.ants.forEach((ant) => {
            ant.set({
                selectable: !lock,
                evented: !lock
            });
        });
        this.discardActiveObject().renderAll();
    }

    setPlay() {

        if (this.isPlay) {
            return;
        }

        this.isPlay = true;

        this.lockCanvas(true);
        this.moveAnts();
    }

    setStep() {

        if (this.isPlay) {
            return;
        }

        this.lockCanvas(true);
        this.moveAnts();
    }

    setStop() {
        this.isPlay = false;
        this.lockCanvas(false);
    }

    updateGeneration() {

        this.generation++;

        this.environment.setBestAnt();

        if (this.bestSolution) {
            this.remove(this.bestSolution);
        }

        this.bestSolution = FabricjsUtils.makeBestSolution(this.environment.bestTour)
        this.add(this.bestSolution);

        this.aco.runGlobalUpdateRule();
        this.updatePheromones();

        this.fire('generationUpdated', {
            generation: this.generation,
            bestTourDistance: this.environment.bestTourDistance
        });
    }

    moveAnts() {

        this.fire('running', {});

        let that = this;

        let promisses = this.environment.ants.map(ant => this.moveAnt(ant));

        Promise.all(promisses).then((result) => {

            var isGenerationDone = result.reduce((acc, v) => acc && v);

            if (isGenerationDone) {
                that.updateGeneration();
            }

            if (that.isPlay) {
                that.moveAnts();
            } else {
                this.fire('stopped', {});
            }
        });
    }

    moveAnt(ant) {

        let that = this;

        return new Promise((resolve) => {

            if (ant.visitedNodeIds.length == that.environment.getNumberOfNodes()) {
                ant.nodeIdsToVisit.push(ant.initialNodeId);
            }

            ant.initializeNodesToVisit(that.environment.nodes);

            let nextNodeId = that.aco.getNextNodeId(ant);
            let nextNode = that.environment.findNodeById(nextNodeId);

            FabricjsUtils.moveWithAnimation(that, ant, nextNode, that.antSpeed).then(() => {

                ant.setCurrentNode(nextNode);

                resolve(ant.isGenerationDone())
            });
        });
    }
}
