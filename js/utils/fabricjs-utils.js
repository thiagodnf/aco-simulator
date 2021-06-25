var NODE_ID = 0;
var ANT_ID = 0;

var LAYER = {
    GRID: 1,
    EDGE: 2,
    NODE: 3,
    ANT: 4,
};

class FabricjsUtils{

    static NODE_RADIUS = 15;

    static getEuclideanDistanceFromArray(array) {

        let total = 0.0;

        for (let i = 0; i < array.length - 1; i++) {
            total += FabricjsUtils.getEuclideanDistance(array[i], array[i + 1]);
        }

        return total;
    }

    static getEuclideanDistance(el1, el2){

        var dx = (el1.left - el2.left);
        var dy = (el1.top - el2.top);

        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }

    static getDefaultSettings(){
        return {
            originX: 'center',
            originY: 'center',
            selectable: false,
            evented: false,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            hasControls: false,
            hasBorders: true,
        }
    }

    static makeCircle(x, y){
        return new fabric.Circle({
            left: x,
            top: y,
            fill: 'white',
            stroke: 'red',
            strokeWidth: 2,
            radius: FabricjsUtils.NODE_RADIUS,
            ...FabricjsUtils.getDefaultSettings()
        });
    }

    static makeText(x, y, text){

        return new fabric.Text(text.toString(), {
            left: x,
            top: y,
            fontSize: 14,
            fill: 'black',
            ...FabricjsUtils.getDefaultSettings()
        });
    }

    static makeEmptyGroup(){
        return new fabric.Group([], {
            selectable: false,
            evented: false,
        });
    }

    static makeGroup(id, items){

        return new fabric.Group(items, {
            id: id,
            ...FabricjsUtils.getDefaultSettings(),
        });
    }

    static makeLine(x1, y1, x2, y2) {
        return new fabric.Line([x1, y1, x2, y2], {
            stroke: 'lightgray',
            strokeWidth: 1,
            selectable: false,
            evented: false,
        });
    }

    static makeGrid(width, height){

        var items = [];

        for (var i = FabricjsUtils.NODE_RADIUS*2,j=1; i < width; i += FabricjsUtils.NODE_RADIUS*2, j++) {
            items.push(FabricjsUtils.makeLine(i, 0, i, height));
            items.push(FabricjsUtils.makeText(i, 7, j));
        }
        for (var i = FabricjsUtils.NODE_RADIUS*2,j=1; i < height; i += FabricjsUtils.NODE_RADIUS*2,j++) {
            items.push(FabricjsUtils.makeLine(0, i, width, i));
            items.push(FabricjsUtils.makeText(7, i, j));
        }

        return new fabric.Group(items, {
            selectable: false,
            evented: false,
            layer: LAYER.GRID,
        });
    }

    static makeEdges(nodes, environment){

        var items = [];

        let values = Object.values(environment.tau);

        let min = Math.min(...values);
        let max = Math.max(...values)

        var normalize = (value, min, max) => {
            return (value - min) / (max - min) * 2
        }

        nodes.forEach(n1 => {
            nodes.forEach(n2 => {
                if (n1 != n2) {

                    let edge = FabricjsUtils.makeLine(n1.left - 5, n1.top - 5, n2.left - 5, n2.top - 5);

                    let tau = environment.getTau(n1.id, n2.id);

                    edge.stroke = 'black';
                    edge.strokeWidth = normalize(tau, min, max);

                    items.push(edge);
                }
            })
        })

        return new fabric.Group(items, {
            selectable: false,
            evented: false,
            layer: LAYER.EDGE,
        });
    }

    static makeBestSolution(nodes){

        var items = [];

        for (var i = 0; i < nodes.length - 1; i++) {

            let source = nodes[i];
            let target = nodes[i + 1];

            let line = FabricjsUtils.makeLine(source.left, source.top, target.left, target.top);

            line.stroke = 'red';
            line.strokeWidth = 2;

            items.push(line);
        }

        return new fabric.Group(items, {
            selectable: false,
            evented: false,
            layer: LAYER.EDGE,
        });
    }

    static makeNode(x, y){

        var nodeId = NODE_ID++;

        var node =  FabricjsUtils.makeCircle(x, y);

        var label = FabricjsUtils.makeText(x, y, nodeId);

        var group = FabricjsUtils.makeGroup(nodeId, [node, label]);

        group.set({
            layer: LAYER.NODE,
        });

        return group;
    }

    static makeEdge(source, target) {
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

    static makeAnt(node){

        var antId = ANT_ID++;

        var img = document.getElementById('ant-image');

        var ant = new fabric.Ant(img, {
            id: antId,
            left: node.left,
            top: node.top,
            layer: LAYER.ANT,
            initialNode: node,
            currentNode: node,
            ...FabricjsUtils.getDefaultSettings()
        });

        ant.scaleToWidth(FabricjsUtils.NODE_RADIUS * 2);
        ant.scaleToHeight(FabricjsUtils.NODE_RADIUS * 2);

        return ant;
    }
}
