var canvas = null;

function resizeWindow() {
    canvas.setWidth($(".col-lg-9").width());
    canvas.setHeight($(window).height() - $("#canvas").offset().top - 20);
    canvas.calcOffset();
}

$(function () {

    canvas = new fabric.Canvas('canvas');

    canvas.perPixelTargetFind = true;

    $(window).resize(resizeWindow);

    resizeWindow();

    canvas.on('mouse:down', function(opt) {

        var el = canvas.findTarget(opt.pointer);

        if (el) {
            return;
        }

        var node = new fabric.Circle({
            left: opt.pointer.x,
            top: opt.pointer.y,
            fill: '#D81B60',
            stroke: "#880E4F",
            radius: 20,
            originX: 'center',
            originY: 'center'
        });

        canvas.add(node);
    })

    $("#add-node").click((event) => {

    })


});
