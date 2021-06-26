'use strict'

var aco = {}

aco.Node = class Node extends fabric.Group {

    static NODE_ID = 0;

    constructor(x, y) {
        super([], {
            selectable: false,
            evented: false,
            layer: LAYER.NODE,
            ...FabricjsUtils.getDefaultSettings(),
        });

        let nodeId = Node.NODE_ID++;

        this.set({
            id: nodeId,
        });

        this.addWithUpdate(FabricjsUtils.makeCircle(x, y));
        this.addWithUpdate(FabricjsUtils.makeText(x, y, nodeId));
    }
}
