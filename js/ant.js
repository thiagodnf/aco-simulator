fabric.Ant = fabric.util.createClass(fabric.Image, {
    type: 'ant',
    initialize: function (element, options) {
        this.callSuper('initialize', element, options);
    },
    setNode: function(node){
        this.node = node;
        this.set({
            top: node.top,
            left: node.left,
        })
    },
    isDone:  function (nextNode){

        var distX = Math.abs(nextNode.left - this.left);
        var distY = Math.abs(nextNode.top - this.top);

        return distX <= 0.1 && distY <= 0.1
    },
    step: function(nextNode, speed){

        var toDegrees = (radians) => {
            return radians * (180 / Math.PI);
        }

        if (this.isDone(nextNode)) {
            this.setNode(nextNode)
            return true;
        }

        var x = (nextNode.left - this.node.left);
        var y = (nextNode.top - this.node.top);
        var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

        var segments = z / speed;

        var cos0 = y / z;
        var sen0 = x / z;
        var angle = 10;

        if (x > 0 && y < 0) {	//Primeiro Quadrante
            angle = 90 - toDegrees(Math.asin(Math.abs(y / z)))
        } else if (x > 0 && y > 0) {	//Segundo Quadrante
            angle = 180 - toDegrees(Math.acos(Math.abs(y / z)));
        } else if (x < 0 && y > 0) {	//Terceiro Quadrante
            angle = 180 + toDegrees(Math.acos(Math.abs(y / z)))
        } else if (x < 0 && y < 0) {	//Quarto Quadrante
            angle = toDegrees(Math.asin(x / z));
        } else if (y == 0 && x < 0) {
            angle = -90;
        } else if (y == 0 && x > 0) {
            angle = 90;
        } else if (y > 0 && x == 0) {
            angle = -180;
        }

        this.set({
            top: this.top += segments * cos0,
            left: this.left += segments * sen0,
            angle: angle,
        });

        return false;
    }
});

// fabric.Ant.fromObject = function (object, callback, context) {
//     fabric.util.loadImage(object.src, function (img) {
//         callback && callback(new fabric.Ant(img, object));
//     });
// };
