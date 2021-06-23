var OPTIONS = {
    ADD_NODE: 1,
    MOVE_NODE: 2,
};


class Canvas {

    constructor() {

        this.antSpeed = 100;
        this.animation = null;

        // Default Settings
        this.nodesLimit = 50;

        this.selectedOption = OPTIONS.ADD_NODE;
        this.nodes = [];
        this.ants = [];
        this.edges = [];
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

    setHeight(height) {
        this.canvas.setHeight(height);
    }

    calcOffset() {
        this.canvas.calcOffset();
    }

    clear() {
        this.canvas.clear();
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

    addNode(pos) {

        if (this.nodes.length >= this.nodesLimit) {
            return;
        }

        var node = FabricjsUtils.makeNode(pos.x, pos.y);
        var ant = FabricjsUtils.makeAnt(node);


        // var ant = new Ant(this, pos.x, pos.y)

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


        //ant.moveTo(10);

        this.nodes.push(node)
        this.ants.push(ant);

        this.canvas.add(node);
        this.canvas.add(ant);

        node.sendToBack();
        ant.bringToFront();

        this.events.emit('addedNode', [node]);
    }

    removeNode(node) {
        this.canvas.remove(node);
        this.nodes = this.nodes.filter(n => n.id !== node.id);
        this.events.emit('removedNode', [node]);
    }

    setAddNode() {
        this.canvas.defaultCursor = 'crosshair';
        this.selectedOption = OPTIONS.ADD_NODE;
        this.canvas.discardActiveObject().renderAll();
        this.nodes.forEach(this.toggleSelectable);
    }

    setMoveNode() {
        this.canvas.defaultCursor = 'default';
        this.selectedOption = OPTIONS.MOVE_NODE;
        this.nodes.forEach(this.toggleSelectable);
    }

    toggleSelectable(node) {
        node.set({
            selectable: !node.selectable,
            evented: !node.selectable
        });
    }

    removeSelectedNodes() {
        this.canvas.getActiveObjects().forEach((node) => {
            this.removeNode(node)
        });
        this.canvas.discardActiveObject().renderAll();
    }

    setAntSpeed(value) {
        this.antSpeed = value;
    }

    setPlay() {
        this.step(this.antSpeed, false)
        this.events.emit('played');
    }

    setStep() {
        this.step(this.antSpeed, true)
        this.events.emit('played');
    }

    clearAll() {
        this.canvas.clear()
        this.nodes = [];
    }

    stop() {
        clearTimeout(this.animation);
        this.animation = null;
        this.events.emit('stopped');
    }

    step(antSpeed, runOnce) {

        this.events.emit('step');

        var that = this;

        var nodeIds = this.nodes.map(e => e.id);

        ArrayUtils.shuffle(nodeIds);

        var render = function () {

            that.canvas.renderAll();

            var dones = [];

            that.ants.forEach((ant, i) => {
                var nextNode = that.findNodeById(nodeIds[i]);
                dones.push(ant.step(nextNode, antSpeed))
            });

            var isDone = dones.reduce((acc, v) => acc && v);

            if (isDone) {
                if (runOnce) {
                    that.stop();
                } else {
                    that.step(that.antSpeed, false);
                }
            } else if (that.animation) {
                that.animation = setTimeout(render, 1);
            }
        }

        that.animation = setTimeout(render, 1);
    }
}
