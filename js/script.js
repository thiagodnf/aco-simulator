var canvas = null;

function resizeWindow() {
    canvas.setWidth($(".col-lg-9").width());
    canvas.setHeight($(window).height() - $("#canvas").offset().top - 20);
    canvas.calcOffset();
}

function setShowPheromones(show) {
    if (show) {

        for(var i=0;i<nodes.length;i++){
            for(var j=i+1;j<nodes.length;j++){

                var edge = makeEdge(nodes[i], nodes[j]);

                edges.push(edge);

                canvas.add(edge);

                edge.sendToBack();

            }
        }

    } else {

        edges.forEach(e => {
            canvas.remove(e);
        });

        edges = [];
    }
}

$(function () {

    canvas = new Canvas();

    $(window).resize(resizeWindow);

    resizeWindow();

    $("#add-node").click(() => canvas.setAddNode());

    $("#move-node").click(() => canvas.setMoveNode());

    $("#clear-all").click((event) => {
        bootbox.confirm("Are you sure?", function(result){
            canvas.clear();
        })
    });

    $(document).keyup(function (e) {
        if (["Backspace", "Delete"].includes(e.key)) {
            canvas.deleteSelectedNodes();
        };
    });

    $('#show-pheromones').change(function() {
        setShowPheromones(this.checked);
    });

    canvas.setAddNode();
});
