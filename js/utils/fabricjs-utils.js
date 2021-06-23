var NODE_ID = 0;

class FabricjsUtils{

    static ANT_IMG = null;

    static loadImages(callback){
        fabric.Image.fromURL('img/ant.png', function(img) {
            FabricjsUtils.ANT_IMG = img;
            callback();
        });
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
            fill: '#fff',
            stroke: 'red',
            strokeWidth: 4,
            radius: 20,
            ...FabricjsUtils.getDefaultSettings()
        });
    }

    static makeText(x, y, text){

        return new fabric.Text(text.toString(), {
            left: x,
            top: y,
            fontSize: 20,
            fill: 'black',
            ...FabricjsUtils.getDefaultSettings()
        });
    }

    static makeGroup(id, items){

        return new fabric.Group(items, {
            id: id,
            ...FabricjsUtils.getDefaultSettings(),
        });
    }

    static makeNode(x, y){

        var nodeId = NODE_ID++;

        var node =  FabricjsUtils.makeCircle(x, y);

        var label = FabricjsUtils.makeText(x, y, nodeId);

        return FabricjsUtils.makeGroup(nodeId, [node, label]);
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

    static makeAnt(x, y){

        var img = document.createElement('img');

        img.src = 'img/ant.png';

        var ant = new fabric.Ant(img, {
            left: x,
            top: y,
            name: 'Image',
            ...FabricjsUtils.getDefaultSettings()
        });

        return ant;
    }
}
