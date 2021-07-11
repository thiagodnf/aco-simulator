var LAYER = {
    GRID: 1,
    EDGE: 2,
    NODE: 3,
    ANT: 4,
};

class FabricjsUtils{

    static NODE_RADIUS = 15;

    static move(el, target, segments) {

        if (FabricjsUtils.isSamePosition(el, target)) {
            return true;
        }

        var dx = (target.left - el.left);
        var dy = (target.top - el.top);
        var dz = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        if(dz == 0){
            throw new Error("dz==0")
        }

        var angle = Math.atan2(dx, dy) * (180 / Math.PI);

        var cos0 = dx / dz;
        var sen0 = dy / dz;

        el.set({
            top: el.top += segments * sen0,
            left: el.left += segments * cos0,
            angle: 180 - angle,
        });
        el.setCoords();

        return false;
    }

    static isSamePosition(el1, el2) {

        var distX = Math.abs(el1.left - el2.left);
        var distY = Math.abs(el1.top - el2.top);

        return distX <= 0.01 && distY <= 0.01
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

    static makeLine(x1, y1, x2, y2) {
        return new fabric.Line([x1, y1, x2, y2], {
            stroke: 'lightgray',
            strokeWidth: 1,
            selectable: false,
            evented: false,
        });
    }

    static makeEdges(environment) {

        var items = [];

        let p = ArrayUtils.minAndMax(environment.tau);

        for (var i = 0; i < environment.getNumberOfNodes(); i++) {
            for (var j = i + 1; j < environment.getNumberOfNodes(); j++) {

                let n1 = environment.findNodeById(i);
                let n2 = environment.findNodeById(j);
                let tau = environment.getTau(i, j);

                let edge = FabricjsUtils.makeLine(n1.left - 5, n1.top - 5, n2.left - 5, n2.top - 5);

                let nTau = NormalizeUtils.normalize(tau, p.min, p.max, 0, 2);

                if (Number.isNaN(nTau)) {
                    nTau = 2;
                }

                edge.stroke = 'black';
                edge.strokeWidth = nTau;

                items.push(edge);
            }
        }

        return new fabric.Group(items, {
            selectable: false,
            evented: false,
            layer: LAYER.EDGE,
        });
    }

    static makeShortestPath(environment){

        let items = [];

        for (var i = 0; i < environment.bestTour.length - 1; i++) {

            let ni = environment.findNodeById(environment.bestTour[i]);
            let nj = environment.findNodeById(environment.bestTour[i + 1]);

            let line = FabricjsUtils.makeLine(ni.left, ni.top, nj.left, nj.top);

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
}
