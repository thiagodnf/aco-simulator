let url = null;
let canvas = null;
let chart = null;

function resizeWindow() {
    canvas.setWidth($(".col-lg-9").width());
    canvas.setHeight($(window).height() - $("#canvas").offset().top - $("footer").height() - 30);
    canvas.calcOffset();
}

function setToolbarActive(active){
    $(".toolbar button").prop( "disabled", active );
    $(".toolbar input").prop( "disabled", active );
    $(".toolbar #stop").prop( "disabled", !active );
}

$(function () {

    url = new Url;
    canvas = new Canvas();
    chart = ChartUtils.init("chart");

    $(window).resize(resizeWindow);

    $(document).keyup(function (e) {
        if (["Backspace", "Delete"].includes(e.key)) {
            canvas.removeSelectedNodes();
        };
    });

    $("#add-node").click(() => canvas.setAddNode());

    $("#move-node").click(() => canvas.setMoveNode());

    $("#clear-all").click(() => {
        if (confirm("Are you sure?")) {
            canvas.clearAll()
        }
    });

    $("#play").click(() => {canvas.setPlay();});

    $("#step").click(() => { canvas.setStep();});

    $("#stop").click(() => canvas.setStop());

    $('#show-pheromones').change(function() {
        canvas.setShowPheromones(this.checked);
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

    canvas.on("generationUpdated", function(data){
        $(".generation-counter").text(data.generation.toLocaleString("en-US"));
        $(".best-value").text(data.bestValue.toLocaleString("en-US"));
        chart.addPoint(data.bestValue);
    });

    canvas.addNode({ x: 90, y: 90 })
    canvas.addNode({ x: 180, y: 90 });
    canvas.addNode({ x: 180, y: 180 })
    canvas.addNode({ x: 90, y: 180 })



    RandomUtils.setSeed(url.query.seed);

    let nodes = RandomUtils.nextNodes(5, canvas.getWidth(), canvas.getHeight());

    nodes.forEach((node) =>{
        // canvas.addNode({ x: node[0], y: node[1] });
    });
});
