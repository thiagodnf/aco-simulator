fabric.Ant = fabric.util.createClass(fabric.Image, {
    type: 'ant',
    initialize: function (element, options) {
        this.callSuper('initialize', element, options);
    },
    setCurrentNode: function (node) {
        this.currentNode = node;
        this.set({
            top: node.top,
            left: node.left,
        })
    },
    isDone: function (nextNode) {

        var distX = Math.abs(nextNode.left - this.left);
        var distY = Math.abs(nextNode.top - this.top);

        return distX <= 0.1 && distY <= 0.1
    },
    step: function (nextNode, speed) {

        if (this.isDone(nextNode)) {
            this.setCurrentNode(nextNode)
            return true;
        }

        var dx = (nextNode.left - this.currentNode.left);
        var dy = (nextNode.top - this.currentNode.top);
        var dz = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        var segments = dz / speed;

        var angle = Math.atan2(dx, dy) * (180 / Math.PI);

        var cos0 = dx / dz;
        var sen0 = dy / dz;

        this.set({
            top: this.top += segments * sen0,
            left: this.left += segments * cos0,
            angle: 180 - angle,
        });

        return false;
    }
});
