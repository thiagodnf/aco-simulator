var OPTIONS = {
    ADD_NODE: 1,
    MOVE_NODE: 2,
};

class Canvas {

    constructor() {

        // Default Settings
        this.nodesLimit = 50;
        this.maxAntSpeed = 500;

        this.antSpeed = 250;
        this.animation = null;
        this.isRunning = false;

        this.grid = null;
        this.bestSolution = null;

        this.nodes = [];
        this.ants = [];
        this.edges = [];
        this.cnn = 1.0;
        this.selectedOption;

        this.canvas = new fabric.Canvas('canvas', {
            selection: false,
            defaultCursor: 'crosshair',
        });

        this.canvas.on('mouse:up', (event) => this.onMoveUp(event));

        this.events = new utils.Events();
        this.environment = new Environment(this);
        this.system = new AntSystem(this);
    }

    on(eventName, callback) {
        this.events.on(eventName, callback);
    }

    onMoveUp(event) {
        if (this.selectedOption == OPTIONS.ADD_NODE) {
            this.addNode(event.pointer);
        }
    }

    setWidth(width) {
        this.canvas.setWidth(width);
    }

    getWidth() {
        return this.canvas.width;
    }

    setHeight(height) {
        this.canvas.setHeight(height);
    }

    getHeight() {
        return this.canvas.height;
    }

    calcOffset() {
        this.canvas.calcOffset();
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

    sortCanvas(){
        this.canvas._objects.sort((a, b) => (a.layer > b.layer) ? 1 : -1);
        this.canvas.renderAll();
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
        this.canvas.add(node);

        this.ants.push(ant);
        this.canvas.add(ant);

        this.sortCanvas()

        this.environment.reset();

        this.upateCnn();

        this.events.emit('addedNode', [node]);



        // console.log(ant)

        // var ant = new Ant();
        // nodes.forEach(function(n){

        //     var edge = makeEdge(newNode, n);

        //     edges.push(edge);

        //     canvas.add(edge);

        //     edge.sendToBack();
        // });

        // newNode.on('moving', function (event) {

        //     that.outEdges(newNode.id).forEach(edge => {

        //         edge.set({
        //             x1: edge.source.getCenterPoint().x,
        //             y1: edge.source.getCenterPoint().y,
        //             x2: edge.target.getCenterPoint().x,
        //             y2: edge.target.getCenterPoint().y
        //         });
        //     });
        // });
    }

    upateCnn(){

        let tour = NearestNeighbour.solve(this);
        let nodes = tour.map(e => this.findNodeById(e));

        this.cnn = FabricjsUtils.getEuclideanDistanceFromArray(nodes)
    }

    getNij(i, j){
        return 1.0 / this.getTourDistance(i, j);
    }

    showGrid(visible) {

        if (!this.grid) {
            this.grid = FabricjsUtils.makeGrid(this.canvas.width, this.canvas.height);
        }

        if (visible) {
            this.canvas.add(this.grid);
        } else {
            this.canvas.remove(this.grid);
        }

        this.sortCanvas();
    }

    setShowPheromones(visible) {

        if (visible) {
            this.edges = FabricjsUtils.makeEdges(this.nodes, this.environment);
            this.canvas.add(this.edges);
        } else {
            this.canvas.remove(this.edges);
        }

        this.sortCanvas();
    }

    updatePheromones(){

        if(this.edges){
            this.canvas.remove(this.edges);
        }

        this.edges = FabricjsUtils.makeEdges(this.nodes, this.environment);

        this.canvas.add(this.edges);

        this.sortCanvas();
    }

    setAddNode() {
        this.canvas.defaultCursor = 'crosshair';
        this.selectedOption = OPTIONS.ADD_NODE;
        this.lockCanvas(true);
    }

    setMoveNode() {
        this.canvas.defaultCursor = 'default';
        this.selectedOption = OPTIONS.MOVE_NODE;
        this.lockCanvas(false);
    }

    removeNode(ant) {

        this.canvas.remove(ant);
        this.canvas.remove(ant.currentNode);

        this.ants = this.ants.filter((n, i) => i !== this.ants.indexOf(ant));
        this.nodes = this.nodes.filter((n, i) => i !== this.nodes.indexOf(ant.currentNode));

        this.upateCnn();

        console.log(this.nodes)
    }

    removeSelectedNodes() {
        this.canvas.getActiveObjects().forEach((node) => {
            this.removeNode(node)
        });
        this.canvas.discardActiveObject().renderAll();
    }

    setAntSpeed(value) {
        this.antSpeed = Math.max(1, this.maxAntSpeed - value);
    }

    clearAll() {
        this.canvas.clear()
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
        this.canvas.discardActiveObject().renderAll();
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
            this.canvas.remove(this.bestSolution);
        }

        this.bestSolution = FabricjsUtils.makeBestSolution(bestTour)
        this.canvas.add(this.bestSolution);

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
            ant.init(this.nodes);
        });

        var render = function () {

            var dones = [];

            that.ants.forEach(ant => {
                dones.push(ant.move(that, antSpeed))
            });

            that.canvas.renderAll();

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
