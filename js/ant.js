fabric.Ant = fabric.util.createClass(fabric.Image, {
    type: 'ant',
    initialize: function (element, options) {
        this.callSuper('initialize', element, options);
        this.on('moving', (event) => this.onMoving(event));

        this.tourDistance = 0.0;
        this.path = {};

        this.nodeIdsToVisit = [];
        this.visitedNodeIds = [];
    },
    initializeNodesToVisit: function(nodes){

        if (this.nodeIdsToVisit.length !== 0) {
            return;
        }

        this.path = {};

        this.tourDistance = 0.0;

        this.currentNodeId = this.initialNodeId;
        this.visitedNodeIds = [this.initialNodeId];
        this.nodeIdsToVisit = nodes.map(n => n.id).filter(id => id != this.initialNodeId);

    },
    onMoving: function (event) {
        this.currentNode.set({
            top: this.top,
            left: this.left,
        });
        this.currentNode.setCoords()
    },
    isGenerationDone: function(){
        return this.currentNodeId == this.initialNodeId;
    },
    setCurrentNode: function (node) {

        this.tourDistance += FabricjsUtils.getEuclideanDistance(this.currentNode, node);
        this.setPath(this.currentNode.id, node.id, 1);
        this.setPath(node.id, this.currentNode.id, 1);

        this.visitedNodeIds.push(node.id);

        this.currentNodeId = node.id;

        this.set({
            top: node.top,
            left: node.left,
        });
        this.setCoords();

        this.nodeIdsToVisit = this.nodeIdsToVisit.filter(id => id != node.id);
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
