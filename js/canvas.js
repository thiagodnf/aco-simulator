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
        this.isPlay = false;

        this.grid = null;
        this.bestSolution = null;
        this.generation = 0;

        this.pheromones = [];
        this.selectedOption;
        this.index = null;

        this.on('mouse:up', (event) => this.onMoveUp(event))

        this.environment = new Environment(this);
        // this.aco = new AntSystem(this.environment);
        this.aco = new AntColonySystem(this.environment);

        this.setAddNode();
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

        if (this.isPlay) {
            return;
        }

        if (this.environment.getNumberOfNodes() >= this.nodesLimit) {
            return;
        }

        var node = new aco.Node(pos.x, pos.y);
        var ant = new aco.Ant(node);

        this.add(node);
        this.add(ant);

        this.environment.addNode(node);
        this.environment.addAnt(ant);

        this.aco.initializeTau();

        this.updatePheromones();

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
        this.pheromones = FabricjsUtils.makeEdges(this.environment);

        if (this.showPheromones) {
            this.add(this.pheromones);
        }

        this.sortCanvas();
    }

    updateGeneration() {

        this.generation++;

        this.environment.updateBestTour();

        if (this.bestSolution) {
            this.remove(this.bestSolution);
        }

        this.bestSolution = FabricjsUtils.makeBestSolution(this.environment)
        this.add(this.bestSolution);

        this.aco.runGlobalPheromoneUpdate();

        this.updatePheromones();

        this.fire('generationUpdated', {
            generation: this.generation,
            bestTourDistance: this.environment.bestTourDistance
        });
    }

    toggleShowGrid() {

        this.showGrid = !this.showGrid;

        this.updateGrid();
    }

    toggleShowPheromones() {

        this.showPheromones = !this.showPheromones;

        this.updatePheromones();
    }

    setACO(aco){
        if(aco == "as"){
            this.aco = new AntSystem(this.environment);
        }else if(aco == "acs"){
            this.aco = new AntColonySystem(this.environment);
        }
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
        this.clear();
        aco.Node.NODE_ID = 0;
        this.environment.nodes = [];
        this.environment.ants = [];
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

    moveAnts() {

        this.fire('running', {});

        let that = this;

        let segments = [];
        let nextNodes = [];

        that.environment.ants.forEach(ant => {

            ant.initializeNodesToVisit(that.environment);

            let currentNode = that.environment.findNodeById(ant.currentNodeId);
            let nextNode = that.aco.getNextNode(ant);

            let distances = FabricjsUtils.getEuclideanDistance(currentNode, nextNode);

            segments.push(distances / that.antSpeed);
            nextNodes.push(nextNode);
        });

        var render = function () {

            let moveDone = [];

            that.environment.ants.forEach((ant, i) => {
                moveDone.push(that.moveAnt(ant, nextNodes[i], segments[i]));
            });

            canvas.renderAll();

            let isMoveDone = moveDone.reduce((acc, v) => acc && v);

            if (isMoveDone) {

                if (that.environment.isGenerationDone()) {
                    that.updateGeneration();
                }

                if (that.isPlay) {
                    that.moveAnts();
                } else {
                    that.fire('stopped', {});
                }
            } else {
                setTimeout(render, 1);
            }
        };

        setTimeout(render, 1);
    }

    moveAnt(ant, nextNode, segments) {

        let that = this;

        let isMoveDone = FabricjsUtils.move(ant, nextNode, segments);

        if (isMoveDone) {

            if (that.aco.localUpdating) {
                that.aco.localUpdating.execute(ant.currentNodeId, nextNode.id);
            }

            ant.setCurrentNode(nextNode);
        }

        return isMoveDone;
    }
}
