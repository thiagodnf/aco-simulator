var OPTIONS = {
    ADD_NODE: 1,
    MOVE_NODE: 2,
};


class Canvas {

    constructor() {

        this.speed = 1;
        this.animation = null;

        // Default Settings
        this.nodesLimit = 5;

        this.selectedOption = OPTIONS.ADD_NODE;
        this.nodes = [];
        this.ants = [];
        this.edges = [];
        this.events = new utils.Events();

        this.canvas = new fabric.Canvas('canvas', {
            selection: false,
            defaultCursor: 'crosshair',
        });

        FabricjsUtils.loadImages();

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



    makeEdge(source, target) {
        return new fabric.Line([source.left, source.top, target.left, target.top], {
            fill: 'black',
            stroke: '#666',
            strokeWidth: 1,
            selectable: false,
            evented: false,
            source: source,
            target: target
        });
    }

    findNodeById(nodeId) {
        return this.nodes.filter(n => n.id === nodeId)[0];
    }

    addNode(pos) {

        if (this.nodes.length >= this.nodesLimit) {
            return;
        }

        var node = FabricjsUtils.makeNode(pos.x, pos.y);
        var ant = FabricjsUtils.makeImage(pos.x, pos.y);

        ant.node = node;

        ant.isDone = () => {

            var distX = Math.pow((ant.node.left - ant.left), 2);
            var distY = Math.pow((ant.node.top - ant.top), 2);

            return distX + distY <= Math.pow(14, 2);
        }

        var toDegrees = (radians) => {
            return radians * (180 / Math.PI);
        }

        var speed = 20;

        ant.step = () => {

            if (ant.isDone()) {
                return true;
            }

            var x = (ant.node.left - ant.left);
            var y = (ant.node.top - ant.top);
            var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            var cos0 = y / z;
            var sen0 = x / z;
            var angle = 10;

            if (x > 0 && y < 0) {	//Primeiro Quadrante
                angle = 90 - toDegrees(Math.asin(Math.abs(y / z)))
            } else if (x > 0 && y > 0) {	//Segundo Quadrante
                angle = 180 - toDegrees(Math.acos(Math.abs(y / z)));
            } else if (x < 0 && y > 0) {	//Terceiro Quadrante
                angle = 180 + toDegrees(Math.acos(Math.abs(y / z)))
            } else if (x < 0 && y < 0) {	//Quarto Quadrante
                angle = toDegrees(Math.asin(x / z));
            } else if (y == 0 && x < 0) {
                angle = -90;
            } else if (y == 0 && x > 0) {
                angle = 90;
            } else if (y > 0 && x == 0) {
                angle = -180;
            }

            ant.set({
                top: ant.top += speed * cos0,
                left: ant.left += speed * sen0,
                angle: angle,
            })

            return false;
        }



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

        this.nodes.push(node)
        this.ants.push(ant);

        this.canvas.add(node);
        this.canvas.add(ant);

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

    clearAll() {
        this.canvas.clear()
        this.nodes = [];
    }

    play() {

        var that = this;

        var render = function () {

            that.canvas.renderAll();

            that.nodes.forEach((node) => node.step());

            that.animation = fabric.util.requestAnimFrame(render);
        }

        fabric.util.requestAnimFrame(render);

        this.events.emit('played');
    }

    stop() {
        // cancelRequestAnimFrame(this.animation);
        clearTimeout(this.animation);
        this.animation = null;
        this.events.emit('stopped');
    }

    step() {

        this.events.emit('step');

        var that = this;

        var nodeIds = this.nodes.map(e => e.id);

        ArrayUtils.shuffle(nodeIds);

        this.ants.forEach((ant, i) => {
            ant.node = this.findNodeById(nodeIds[i]);
        });

        var render = function () {

            that.canvas.renderAll();

            var dones = [];

            that.ants.forEach((ant, i) => {
                dones.push(ant.step())
            });

            var isDone = dones.reduce((acc, v) => acc && v);

            if (isDone) {
                that.stop();
            } else {
                that.animation = setTimeout(render, that.speed);
                //that.animation = fabric.util.requestAnimFrame(render);
            }
        }

        render();
        // this.animation = setInterval(render, this.speed);

        // fabric.util.requestAnimFrame(render);
    }
}
