let url = null;
let canvas = null;
let chart = null;
let $generationCounter = null;
let $bestValue = null;

function resizeWindow() {
    canvas.resize(
        $(".col-lg-9").width(),
        $(window).height() - $("#canvas").offset().top - $("footer").height() - 30
    );
}

function setToolbarActive(active){
    $(".toolbar button").prop( "disabled", active );
    $(".toolbar input").prop( "disabled", active );
    $(".toolbar #stop").prop( "disabled", !active );
}

$(function () {

    url = new Url;

    RandomUtils.setSeed(url.query.seed);

    canvas = new Canvas();
    chart = ChartUtils.init("chart");
    $generationCounter = $(".generation-counter");
    $bestValue = $(".best-value");

    $(window).resize(resizeWindow);

    $(document).keyup(function (e) {
        if (["Backspace", "Delete"].includes(e.key)) {
            canvas.removeSelectedNodes();
        };
    });

    window.onerror = (errorMsg, url, lineNumber) => {
        alert(errorMsg);
        return false;
    }

    $("#play").click(() => {canvas.setPlay();});

    $("#step").click(() => { canvas.setStep();});

    $("#stop").click(() => canvas.setStop());

    $("#add-node").click(() => canvas.setAddNode());

    $("#move-node").click(() => canvas.setMoveNode());

    $("#clear-all").click(() => {
        if (confirm("Are you sure?")) {
            canvas.setClearAll()
        }
    });

    $('#show-grid').change(() => canvas.toggleShowGrid());
    $('#show-pheromones').change(() => canvas.toggleShowPheromones());

    $('#alpha').change(function(){canvas.environment.alpha = $( this ).val();});
    $('#beta').change(function(){canvas.environment.beta = $( this ).val();});
    $('#rho').change(function(){canvas.environment.rho = $( this ).val();});

    $('input[name=ant-speed').change(function() {
        canvas.setAntSpeed(this.value)
    });

    $('#ant-speed-value').text(canvas.antSpeed)

    resizeWindow();

    canvas.on("running", () =>{
        setToolbarActive(true);
    });

    canvas.on("stopped", () =>{
        setToolbarActive(false);
    });

    canvas.on("generationUpdated", function(data){
        $generationCounter.text(data.generation.toLocaleString("en-US"));
        $bestValue.text(data.bestTourDistance.toLocaleString("en-US"));
        chart.addPoint(data.bestTourDistance);
    });

    canvas.addNode({ x: 90, y: 90 })
    canvas.addNode({ x: 180, y: 90 });
    canvas.addNode({ x: 180, y: 180 })
    canvas.addNode({ x: 90, y: 180 })


    // let nodes = RandomUtils.nextNodes(5, canvas.getWidth(), canvas.getHeight());

    // nodes.forEach((node) =>{
    //     // canvas.addNode({ x: node[0], y: node[1] });
    // });
});
