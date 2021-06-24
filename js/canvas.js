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

        this.nodes = [];
        this.ants = [];
        this.edges = [];
        this.selectedOption;
        this.events = new utils.Events();

        this.canvas = new fabric.Canvas('canvas', {
            selection: false,
            defaultCursor: 'crosshair',
        });

        this.canvas.on('mouse:up', (event) => this.onMoveUp(event));
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
        this.ants.push(ant);

        this.canvas.add(node);
        this.canvas.add(ant);

        this.sortCanvas()

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

    updateCanvas(antSpeed, runOnce) {

        var that = this;

        that.events.emit('running');

        var nodeIds = this.nodes.map(e => e.id);

        ArrayUtils.shuffle(nodeIds);

        var render = function () {

            var dones = [];

            that.ants.forEach((ant, i) => {
                var nextNode = that.findNodeById(nodeIds[i]);
                dones.push(ant.move(nextNode, antSpeed))
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
