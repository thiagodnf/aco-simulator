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
        this.nodesLimit = 150;
        this.showPheromones = false;

        this.antSpeed = 80;
        this.animation = null;
        this.isPlay = false;

        // Pan
        this.isDragging = false;
        this.lastPosX = 0;
        this.lastPosY = 0;

        this.bestSolution = null;
        this.generation = 0;

        this.pheromones = [];
        this.selectedOption;
        this.index = null;

        this.on('mouse:up', (event) => this.onMoveUp(event))
        this.on('mouse:down', (event) => this.onMoveDown(event))
        this.on('mouse:move', (event) => this.onMoveMove(event))
        this.on('mouse:wheel', (event) => this.onMoveWheel(event))

        this.environment = new Environment(this);
        this.aco = new AntSystem(this.environment);

        this.setAddNode();
    }

    onMoveUp(event) {

        if (this.selectedOption == OPTIONS.ADD_NODE) {
            this.addNode([event.absolutePointer]);
        }

        this.setViewportTransform(this.viewportTransform);
        this.isDragging = false;
    }

    onMoveDown(event) {

        if (this.selectedOption == OPTIONS.MOVE_NODE) {

            let target = this.findTarget(event, false);

            if (!target) {
                this.isDragging = true;
                this.lastPosX = event.e.clientX;
                this.lastPosY = event.e.clientY;
            }
        }
    }

    onMoveMove(event) {

        if (this.isDragging) {
            var e = event.e;
            var vpt = this.viewportTransform;
            vpt[4] += e.clientX - this.lastPosX;
            vpt[5] += e.clientY - this.lastPosY;
            this.requestRenderAll();
            this.lastPosX = e.clientX;
            this.lastPosY = e.clientY;
        }
    }

    onMoveWheel(opt){
        var delta = opt.e.deltaY;
        var zoom = canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
    }

    resize(width, height) {
        this.setDimensions({ width: width, height: height });
        this.calcOffset();
    }

    addNode(positions) {

        if (this.isPlay) {
            return;
        }

        if (this.environment.getNumberOfNodes() >= this.nodesLimit) {
            return;
        }

        positions.forEach(pos => {

            var node = new aco.Node(pos.x, pos.y);
            var ant = new aco.Ant(this.environment, node);

            this.add(node);
            this.add(ant);

            this.environment.addNode(node);
            this.environment.addAnt(ant);
        });

        this.environment.init();

        this.aco.initializeTau();

        this.generation = 0;
        this.updateBestSolution();
        this.updatePheromones();

        this.fire('generationUpdated', canvas);

        this.updatePheromones();

        this.sortCanvas();

        this.fire('addedNode', positions);
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

    updatePheromones() {
        this.remove(this.pheromones);
        this.pheromones = FabricjsUtils.makeEdges(this.environment);

        if (this.showPheromones) {
            this.add(this.pheromones);
        }

        this.sortCanvas();
    }

    updateBestSolution(){

        if (this.bestSolution) {
            this.remove(this.bestSolution);
        }

        this.bestSolution = FabricjsUtils.makeBestSolution(this.environment)
        this.add(this.bestSolution);
    }

    updateGeneration() {

        this.generation++;

        this.environment.updateBestTour();

        this.aco.runGlobalPheromoneUpdate();

        this.updateBestSolution();
        this.updatePheromones();

        this.fire('generationUpdated', canvas);
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

        if (this.isPlay || this.environment.getNumberOfNodes() <= 1) {
            return;
        }

        this.isPlay = true;

        this.lockCanvas(true);
        this.moveAnts();
    }

    setStep() {

        if (this.isPlay || this.environment.getNumberOfNodes() <= 1) {
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
