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

        this.grid = null;
        this.bestSolution = null;

        this.nodes = [];
        this.ants = [];
        this.pheromones = [];
        this.cnn = 1.0;
        this.selectedOption;

        this.on('mouse:up', (event) => this.onMoveUp(event))

        this.events = new utils.Events();
        this.environment = new Environment(this);
        this.system = new AntSystem(this);
    }

    // on(eventName, callback) {
    //     this.events.on(eventName, callback);
    // }

    onMoveUp(event) {
        if (this.selectedOption == OPTIONS.ADD_NODE) {
            this.addNode(event.pointer);
        }
    }

    resize(width, height){
        this.setDimensions({width: width, height: height});
        this.calcOffset();
        this.updateGrid();
    }

    addNode(pos) {

        if (this.isRunning) {
            return;
        }

        if (this.nodes.length >= this.nodesLimit) {
            return;
        }

        var node = FabricjsUtils.makeNode(pos.x, pos.y);
        var ant = FabricjsUtils.makeAnt(node);

        this.nodes.push(node)
        this.add(node);

        if(this.ants.length <= 3){
        this.ants.push(ant);
        this.add(ant);
        }

        this.environment.reset();

        this.updatePheromones();
        this.upateCnn();
        this.sortCanvas();

        this.events.emit('addedNode', [node]);
    }

    sortCanvas(){
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

    findNodeById(nodeId) {
        return this.nodes.filter(n => n.id === nodeId)[0];
    }


    upateCnn(){

        let tour = NearestNeighbour.solve(this);
        let nodes = tour.map(e => this.findNodeById(e));

        this.cnn = FabricjsUtils.getEuclideanDistanceFromArray(nodes)
    }

    getNij(i, j){
        return 1.0 / this.getTourDistance(i, j);
    }

    replace(oldEl, newEl){
        if (visible) {
            this.add(el);
        } else {
            this.remove(el);
        }
        this.sortCanvas();
    }

    setVisible(el, visible){
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
        this.pheromones = FabricjsUtils.makeEdges(this.nodes, this.environment);

        if (this.showPheromones) {
            this.add(this.pheromones);
        }

        this.sortCanvas();
    }

    toggleShowGrid() {

        this.showGrid =  !this.showGrid;

        this.updateGrid();
    }

    toggleShowPheromones() {

        this.showPheromones =  !this.showPheromones;

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

    getAlpha(){
        return 2.0;
    }

    getBeta(){
        return 1.0;
    }

    lockCanvas(lock){
        this.ants.forEach((ant) => {
            ant.set({
                selectable: !lock,
                evented: !lock
            });
        });
        this.discardActiveObject().renderAll();
    }

    setPlay() {

        if (this.isRunning) {
            return;
        }

        this.isRunning = true;
        this.lockCanvas(true);
        this.updateCanvas(this.antSpeed, false)
    }

    setStep() {

        if (this.isRunning) {
            return;
        }

        this.isRunning = true;
        this.lockCanvas(true);
        this.updateCanvas(this.antSpeed, true)
    }

    setStop(){
        this.isRunning = false;
    }

    stop(){
        this.isRunning = false;
        this.lockCanvas(false);
        this.events.emit('stopped');
    }

    updateGeneration(generation, bestTour, bestValue){

        if (this.bestSolution) {
            this.remove(this.bestSolution);
        }

        this.bestSolution = FabricjsUtils.makeBestSolution(bestTour)
        this.add(this.bestSolution);

        this.sortCanvas()

        this.system.runGlobalUpdateRule();

        this.updatePheromones();

        this.events.emit('generationUpdated', [{generation, bestValue}]);
    }

    getNumberOfAnts(){
        return this.ants.length;
    }

    getNumberOfNodes(){
        return this.nodes.length;
    }

    getTourDistance(i, j){
        return FabricjsUtils.getEuclideanDistance(this.findNodeById(i), this.findNodeById(j));
    }

    updateCanvas(antSpeed, runOnce) {

        var that = this;

        that.events.emit('running');

        that.ants.forEach(ant => {
            ant.initializeNodesToVisit(this.nodes);
        });

        var render = function () {

            var dones = [];

            that.ants.forEach(ant => {
                dones.push(ant.move(that, antSpeed))
            });

            that.renderAll();

            var isDone = dones.reduce((acc, v) => acc && v);

            if (isDone) {
                if (runOnce) {
                    that.stop();
                } else {
                    if (that.isRunning) {
                        that.updateCanvas(that.antSpeed, false);
                    } else {
                        clearTimeout(that.animation);
                        that.stop();
                    }
                }
            } else if (that.animation) {
                that.animation = setTimeout(render, 1);
            }
        }

        that.animation = setTimeout(render, 1);
    }
}
