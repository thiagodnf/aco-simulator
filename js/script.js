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

    $("#play").click(() => {canvas.play();});

    $("#step").click(() => { canvas.step();});

    $("#stop").click(() => canvas.stop());

    $('#show-pheromones').change(function() {
        setShowPheromones(this.checked);
    });

    $('#ant-speed').change(function() {
        canvas.setAntSpeed(this.value)
        $('#ant-speed-value').text(canvas.antSpeed)
    });

    resizeWindow();

    canvas.setAddNode();

    canvas.on("running", () =>{
        setToolbarActive(true);
    });

    canvas.on("stopped", () =>{
        setToolbarActive(false);
    });

    canvas.addNode({ x: 100, y: 100 })
    canvas.addNode({ x: 200, y: 200 })
    canvas.addNode({ x: 100, y: 200 })
    canvas.addNode({ x: 200, y: 100 })

    $('#ant-speed-value').text(canvas.antSpeed)
});
