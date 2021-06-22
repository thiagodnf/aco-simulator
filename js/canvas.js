var OPTIONS = {
    ADD_NODE : 1,
    MOVE_NODE: 2,
};

var NODE_ID = 1;

var ANT_IMG = null;

class Canvas {

    constructor() {

        // Default Settings
        this.nodesLimit = 5;

        this.selectedOption = OPTIONS.ADD_NODE;
        this.nodes = [];
        this.edges = [];
        this.events = new utils.Events();

        this.canvas = new fabric.Canvas('canvas', {
            selection: false,
            defaultCursor: 'crosshair'
        });

        fabric.Image.fromURL('img/ant.png', function(img) {
            ANT_IMG = img;
        });

        this.canvas.on('mouse:up', (event) => this.onMoveUp(event));
    }

    on(eventName, callback){
        this.events.on(eventName, callback);
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

        this.edges.forEach(function(edge){
            if(edge.source.id == id){
                selected.push(edge);
            }else if(edge.target.id == id){
                selected.push(edge);
            }
        });

        return selected;
    }

    makeAnt(){

        var ant = fabric.util.object.clone(ANT_IMG);

        ant.set({
            left: 0,
            top: 0,
            hasControls: false,
            hasBorders: true,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
        });

        return ant;
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
            id: nodeId,
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

        if (this.nodes.length >= this.nodesLimit) {
            return;
        }

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

        this.events.emit('addedNode', [newNode]);
    }

    removeNode(node){
        this.canvas.remove(node);
        this.nodes = this.nodes.filter(n => n.id !== node.id);
        this.events.emit('removedNode', [node]);
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

    removeSelectedNodes(){
        this.canvas.getActiveObjects().forEach((node) => {
            this.removeNode(node)
        });
        this.canvas.discardActiveObject().renderAll();
    }

    clearAll(){
        this.canvas.clear()
        this.nodes = [];
    }

    play(){

    }

    stop(){

    }

    async step(callback){

        this.canvas.add(this.makeAnt());

        await new Promise(r => setTimeout(r, 1000));

        callback();
    }
}
