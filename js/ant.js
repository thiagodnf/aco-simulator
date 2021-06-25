fabric.Ant = fabric.util.createClass(fabric.Image, {
    type: 'ant',
    initialize: function (element, options) {
        this.callSuper('initialize', element, options);
        this.on('moving', (event) => this.onMoving(event));
        this.nextNode = null;
        this.path = {};
        this.nodesToVisit = [];
        this.tourDistance = 0.0;
        this.visitedNodes = [];
    },
    initializeNodesToVisit: function(nodes){

        if (this.nodesToVisit.length !== 0) {
            return;
        }

        this.path = {};
        this.nodesToVisit = [];
        this.tourDistance = 0.0;
        this.currentNode = this.initialNode;
        this.visitedNodes = [this.initialNode];
        this.nodesToVisit = nodes.filter(n => n.id !== this.initialNode.id);
    },
    onMoving: function (event) {
        this.currentNode.set({
            top: this.top,
            left: this.left,
        });
        this.currentNode.setCoords()
    },
    onDone: function (canvas) {

        this.tourDistance += FabricjsUtils.getEuclideanDistance(this.currentNode, this.nextNode);
        this.setPath(this.currentNode.id, this.nextNode.id, 1);
        this.setPath(this.nextNode.id, this.currentNode.id, 1);

        this.visitedNodes.push(this.nextNode);

        this.setCurrentNode(this.nextNode)
        this.nodesToVisit = this.nodesToVisit.filter(n => n.id !== this.nextNode.id);

        this.nextNode = null;

        if (this.nodesToVisit.length == 0) {
            if (this.currentNode.id == this.initialNode.id) {
                canvas.environment.setTourDone(this);
            } else {
                this.nodesToVisit = [this.initialNode];
            }
        }
    },
    setCurrentNode: function (node) {
        this.currentNode = node;
        this.set({
            top: node.top,
            left: node.left,
        });
        this.setCoords()
    },
    isDone: function () {

        if (!this.nextNode) {
            return true;
        }

        var distX = Math.abs(this.nextNode.left - this.left);
        var distY = Math.abs(this.nextNode.top - this.top);

        return distX <= 0.1 && distY <= 0.1
    },
    move: function (canvas, speed) {

        if (!this.nextNode) {
            this.nextNode = canvas.findNodeById(canvas.system.getNextNodeId(this));
        }

        if (this.isDone()) {
            this.onDone(canvas)
            return true;
        }

        var dx = (this.nextNode.left - this.currentNode.left);
        var dy = (this.nextNode.top - this.currentNode.top);
        var dz = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        var segments = dz / speed;

        var angle = Math.atan2(dx, dy) * (180 / Math.PI);

        var cos0 = dx / dz;
        var sen0 = dy / dz;

        this.set({
            top: this.top += segments * sen0,
            left: this.left += segments * cos0,
            angle: 180 - angle,
        });

        return false;
    },
    getPath: function(i, j) {
        if (i < j) {
            return this.path[i + "_" + j];
        } else {
            return this.path[j + "_" + i];
        }
    },
    setPath: function(i, j, value) {
        if (i < j) {
            this.path[i + "_" + j] = value;
        } else {
            this.path[j + "_" + i] = value;
        }
    }
});
