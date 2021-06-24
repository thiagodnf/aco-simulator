fabric.Ant = fabric.util.createClass(fabric.Image, {
    type: 'ant',
    initialize: function (element, options) {
        this.callSuper('initialize', element, options);
        this.on('moving', (event) => this.onMoving(event));
        this.nextNode = null;
        this.nodesToVisit = []
        this.visitedNodes = []
    },
    init: function(nodes){

        if (this.nodesToVisit.length != 0) {
            return;
        }
        if(this.currentNode != this.initialNode){
            this.nodesToVisit = [this.initialNode];
            return;
        }

        this.nodesToVisit = []
        this.visitedNodes = [this.initialNode]
        this.currentNode = this.initialNode;

        nodes.forEach(node => {
            if (node != this.initialNode) {
                this.nodesToVisit.push(node);
            }
        });

        //console.log(this.currentNode.id, this.nodesToVisit.map(e => e.id));
    },
    onMoving: function (event) {
        this.currentNode.set({
            top: this.top,
            left: this.left,
        });
        this.currentNode.setCoords()
    },
    onDone: function (canvas, nextNode) {
        this.setCurrentNode(nextNode)
        this.nextNode = null;
        this.visitedNodes.push(nextNode);
        this.nodesToVisit = this.nodesToVisit.filter(n => n.id !== nextNode.id);

        if (this.currentNode == this.initialNode) {
            canvas.environment.updateBestAnt(this);
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
    isDone: function (nextNode) {

        var distX = Math.abs(nextNode.left - this.left);
        var distY = Math.abs(nextNode.top - this.top);

        return distX <= 0.1 && distY <= 0.1
    },
    move: function (canvas, speed) {

        if(!this.nextNode){
            this.nextNode = canvas.findNodeById(canvas.system.getNextNodeId(this));
        }

        if (this.isDone(this.nextNode)) {
            this.onDone(canvas, this.nextNode)
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
    }
});
