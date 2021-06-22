var OPTIONS = {
    ADD_NODE : 1,
    MOVE_NODE: 2,
};

var NODE_ID = 1;

class Canvas {

    constructor() {

        // Default Settings
        this.nodesLimit = 5;

        this.selectedOption = OPTIONS.ADD_NODE;
        this.nodes = [];

        this.canvas = new fabric.Canvas('canvas', {
            selection: false,
            defaultCursor: 'crosshair'
        });

        this.canvas.on('mouse:up', (event) => this.onMoveUp(event));
    }

    onMoveUp(event) {
        if (this.selectedOption == OPTIONS.ADD_NODE) {
            this.addNode(event.pointer);
        }
    }

    setWidth(width){
        this.canvas.setWidth(width);
    }

    setHeight(height){
        this.canvas.setHeight(height);
    }

    calcOffset(){
        this.canvas.calcOffset();
    }

    clear(){
        this.canvas.clear();
    }

    outEdges(id){

        var selected = [];

        edges.forEach(function(edge){
            if(edge.source.id == id){
                selected.push(edge);
            }else if(edge.target.id == id){
                selected.push(edge);
            }
        });

        return selected;
    }

    makeNode(x, y){

        var nodeId = NODE_ID++;

        var node = new fabric.Circle({
            left: x,
            top: y,
            fill: '#fff',
            stroke: 'red',
            strokeWidth: 4,
            radius: 14,
            originX: 'center',
            originY: 'center',
        });

        var label = new fabric.Text(nodeId.toString(), {
            left: node.left,
            top: node.top,
            fontSize: 14,
            originX: 'center',
            originY: 'center',
            fill: 'black'
        });

        return new fabric.Group([node, label], {
            id: nodeId.toString(),
            left: node.left,
            top: node.top,
            originX: 'center',
            originY: 'center',
            selectable: false,
            evented: false,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            hasControls: false,
            hasBorders: true,
        });
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

    addNode(pos){


        let that = this;

        var newNode = this.makeNode(pos.x, pos.y);

        // nodes.forEach(function(n){

        //     var edge = makeEdge(newNode, n);

        //     edges.push(edge);

        //     canvas.add(edge);

        //     edge.sendToBack();
        // });

        newNode.on('moving', function (event) {

            that.outEdges(newNode.id).forEach(edge => {

                edge.set({
                    x1: edge.source.getCenterPoint().x,
                    y1: edge.source.getCenterPoint().y,
                    x2: edge.target.getCenterPoint().x,
                    y2: edge.target.getCenterPoint().y
                });
            });
        });

        this.nodes.push(newNode)
        this.canvas.add(newNode);
    }

    setAddNode(){
        this.canvas.defaultCursor = 'crosshair';
        this.selectedOption = OPTIONS.ADD_NODE;
        this.canvas.discardActiveObject().renderAll();
        this.nodes.forEach(this.toggleSelectable);
    }

    setMoveNode(){
        this.canvas.defaultCursor = 'default';
        this.selectedOption = OPTIONS.MOVE_NODE;

        this.nodes.forEach(this.toggleSelectable);
    }

    toggleSelectable(node){
        node.set({
            selectable: !node.selectable,
            evented: !node.selectable
        });
    }

    deleteSelectedNodes(){
        this.canvas.remove(...this.canvas.getActiveObjects());
        this.canvas.discardActiveObject().renderAll();
    }

    clearAll(){
        this.canvas.clear()
        this.nodes = [];
    }
}
