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

function setToolbarActive(active){
    $(".toolbar button").prop( "disabled", active );
    $(".toolbar input").prop( "disabled", active );
    $(".toolbar #stop").prop( "disabled", !active );
}

$(function () {

    canvas = new Canvas();

    $(window).resize(resizeWindow);

    $(document).keyup(function (e) {
        if (["Backspace", "Delete"].includes(e.key)) {
            canvas.removeSelectedNodes();
        };
    });

    $("#add-node").click(() => canvas.setAddNode());

    $("#move-node").click(() => canvas.setMoveNode());

    $("#clear-all").click(() => canvas.clear());

    $("#play").click(() => {
        canvas.play();
        setToolbarActive(true);
    });

    $("#step").click(() => {
        setToolbarActive(true);
        canvas.step(() =>{
            setToolbarActive(false);
        });
    });

    $("#stop").click(() => {
        canvas.stop();
        setToolbarActive(false);
    });


    $('#show-pheromones').change(function() {
        setShowPheromones(this.checked);
    });

    resizeWindow();

    canvas.setAddNode();

    canvas.on("addedNode", (a) =>{

    });
});
