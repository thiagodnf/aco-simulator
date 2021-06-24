var NODE_ID = 0;

var LAYER = {
    GRID: 1,
    EDGE: 2,
    NODE: 3,
    ANT: 4,
};



class FabricjsUtils{

    static NODE_RADIUS = 15;

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

        for (var i = NODE_RADIUS*2; i < width; i += FabricjsUtils.NODE_RADIUS*2) {
            items.push(FabricjsUtils.makeLine(i, 0, i, height));
        }
        for (var i = NODE_RADIUS*2; i < height; i += FabricjsUtils.NODE_RADIUS*2) {
            items.push(FabricjsUtils.makeLine(0, i, width, i));
        }

        return new fabric.Group(items, {
            selectable: false,
            evented: false,
            layer: LAYER.GRID,
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

        var img = document.getElementById('ant-image');

        var ant = new fabric.Ant(img, {
            left: node.left,
            top: node.top,
            layer: LAYER.ANT,
            initialNode: node,
            currentNode: node,
            ...FabricjsUtils.getDefaultSettings()
        });

        ant.scaleToWidth(30);
        ant.scaleToHeight(30);

        return ant;
    }
}
