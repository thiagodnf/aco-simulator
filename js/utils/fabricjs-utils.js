var NODE_ID = 0;

class FabricjsUtils{

    static ANT_IMG = null;

    static loadImages(){
        fabric.Image.fromURL('img/ant.png', function(img) {
            FabricjsUtils.ANT_IMG = img;
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

    static makeImage(x, y){

        var ant = fabric.util.object.clone(FabricjsUtils.ANT_IMG);

        ant.set({
            left: x,
            top: y,
            ...FabricjsUtils.getDefaultSettings()
        });

        return ant;
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
            fontSize: 14,
            fill: 'black',
            ...FabricjsUtils.getDefaultSettings()
        });
    }

    static makeGroup(id, items){

        return new fabric.Group(items, {
            id: id,

            ...FabricjsUtils.getDefaultSettings(),

            step: () =>{
                ant.step();
                //
            }
        });
    }

    static makeNode(x, y){

        var nodeId = NODE_ID++;

        var node =  FabricjsUtils.makeCircle(x, y);

        var label = FabricjsUtils.makeText(x, y, nodeId);

        return FabricjsUtils.makeGroup(nodeId, [node, label]);
    }
}
