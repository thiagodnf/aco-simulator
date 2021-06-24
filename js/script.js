var canvas = null;

function resizeWindow() {
    canvas.setWidth($(".col-lg-9").width());
    canvas.setHeight($(window).height() - $("#canvas").offset().top - $("footer").height() - 30);
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

    var url  = new Url;
    canvas = new Canvas();

    $(window).resize(resizeWindow);

    $(document).keyup(function (e) {
        if (["Backspace", "Delete"].includes(e.key)) {
            canvas.removeSelectedNodes();
        };
    });

    $("#add-node").click(() => canvas.setAddNode());

    $("#move-node").click(() => canvas.setMoveNode());

    $("#clear-all").click(() => {
        if(confirm("Are you sure?")){
            canvas.clearAll()
        }
    });

    $("#play").click(() => {canvas.setPlay();});

    $("#step").click(() => { canvas.setStep();});

    $("#stop").click(() => canvas.setStop());

    $('#show-pheromones').change(function() {
        setShowPheromones(this.checked);
    });

    $('#show-grid').change((function() {
        canvas.showGrid(this.checked);
    }));

    $('#ant-speed').change(function() {
        canvas.setAntSpeed(this.value)
        $('#ant-speed-value').text(canvas.antSpeed)
    });

    $('#ant-speed-value').text(canvas.antSpeed)

    resizeWindow();

    canvas.setAddNode();

    canvas.on("running", () =>{
        setToolbarActive(true);
    });

    canvas.on("stopped", () =>{
        setToolbarActive(false);
    });

    // canvas.addNode({ x: 90, y: 90 })
    // canvas.addNode({ x: 180, y: 180 })
    // canvas.addNode({ x: 90, y: 180 })
    // canvas.addNode({ x: 180, y: 90 });

    RandomUtils.setSeed(url.query.seed);

    let nodes = RandomUtils.nextNodes(5, canvas.getWidth(), canvas.getHeight());

    nodes.forEach((node) =>{
        canvas.addNode({ x: node[0], y: node[1] });
    })
    console.log(nodes);

    // let numberOfNodes = RandomUtils.nextInt(1, canvas.nodesLimit / 2);

    // for (var i = 0; i < numberOfNodes; i++) {

    //     let x = RandomUtils.nextFloat(100, 500);
    //     let y = RandomUtils.nextFloat(100, 500);

    //     canvas.addNode({ x: x, y: y })
    // }
    // console.log(numberOfNodes)

    //console.log(RandomUtils.nextInt(10,20));
});
