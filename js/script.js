var OPTIONS = {
    ADD_NODE : 1,
    MOVE_NODE: 2,
    REMOVE_NODE: 3
};

var NODE_ID = 1;

var canvas = null;
var selectedOption = OPTIONS.ADD_NODE;
var nodes = [];

var nodeGroup = new fabric.Group([], {});

var edges = [];

function resizeWindow() {
    canvas.setWidth($(".col-lg-9").width());
    canvas.setHeight($(window).height() - $("#canvas").offset().top - 20);
    canvas.calcOffset();
}

function outEdges(id){

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

function makeNode(x, y){

    var nodeId = NODE_ID++;

    var node = new fabric.Circle({
        id: nodeId.toString(),
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
        evented: false
    });
}

function makeEdge(source, target) {
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

function addNode(pos){

    var newNode = makeNode(pos.x, pos.y);

    nodes.forEach(function(n){

        var edge = makeEdge(newNode, n);

        edges.push(edge);

        canvas.add(edge);

        edge.sendToBack();
    });

    newNode.on('moving', function (event) {

        outEdges(newNode.id).forEach(edge => {

            edge.set({
                x1: edge.source.getCenterPoint().x,
                y1: edge.source.getCenterPoint().y,
                x2: edge.target.getCenterPoint().x,
                y2: edge.target.getCenterPoint().y
            });
        });
    });

    nodes.push(newNode)
    canvas.add(newNode);
}

function deleteSelectedNodes(){
    canvas.getActiveObjects().forEach((object) => {
        canvas.remove(object)
    });
    canvas.discardActiveObject().renderAll();
}

function setAddNode(){
    canvas.defaultCursor = 'crosshair';
    selectedOption = OPTIONS.ADD_NODE;

    nodes.forEach(function(node){
        node.set({
            selectable: false,
            evented: false
        });
    });

    // canvas.renderAll();
}

function setMoveNode(){
    canvas.defaultCursor = 'default';
    selectedOption = OPTIONS.MOVE_NODE;

    nodes.forEach(function(node){
        node.set({
            selectable: true,
            evented: true
        });
    });
}

$(function () {

    canvas = new fabric.Canvas('canvas', {
        selection: false,
        defaultCursor: 'crosshair'
    });

    $(window).resize(resizeWindow);

    resizeWindow();

    canvas.on('mouse:up', function(opt) {

        if(selectedOption == OPTIONS.ADD_NODE){

            var el = canvas.findTarget(opt.pointer);

            if (el) {
                return;
            }

            addNode(opt.pointer);
        }
    });


    $("#add-node").click((event) => {
        setAddNode();
    });

    $("#move-node").click((event) => {
        setMoveNode();
    });

    $("#clear-all").click((event) => {
        bootbox.confirm("Are you sure?", function(result){
            canvas.clear();
        })
    });

    $(document).keyup(function (e) {
        if (e.key === "Backspace") {
            deleteSelectedNodes();
        };
    });

    setAddNode();
});
