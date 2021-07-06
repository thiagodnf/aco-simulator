let url = null;
let canvas = null;
let chartGlobalBestValue = null;
let chartAverageBestValue = null;
let $generationCounter =    null;
let $bestValue = null;

function resizeWindow() {

    let canvasHeight = $(window).height() - $("#canvas").offset().top - $("footer").height() - 30;

    canvas.resize($(".col-lg-9").width(), canvasHeight);

    $("#sidebar").height(canvasHeight - 2);
}

function setToolbarActive(active){
    $(".btn-toolbar button").prop( "disabled", active );
    $(".btn-toolbar input").prop( "disabled", active );
    $(".btn-toolbar #stop").prop( "disabled", !active );
}

$(function () {

    url = new Url;

    RandomUtils.setSeed(url.query.seed);

    canvas = new Canvas();
    chartGlobalBestValue = ChartUtils.init("chart-global-best-value", "Global Best Value", "#7cb5ec");
    chartAverageBestValue = ChartUtils.init("chart-average-best-value", "Average Best Value", "#90ed7d");
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

    $('#show-pheromones').change(() => canvas.toggleShowPheromones());

    $('#alpha').change(function(){canvas.environment.alpha = parseFloat($( this ).val());});
    $('#beta').change(function(){canvas.environment.beta = parseFloat($( this ).val());});
    $('#rho').change(function(){canvas.environment.rho = parseFloat($( this ).val());});
    $('#omega').change(function(){canvas.environment.omega = parseFloat($( this ).val());});
    $('#q0').change(function(){canvas.environment.q0 = parseFloat($( this ).val());});
    $('#aco').change(function(){canvas.setACO($( this ).val())});

    $('input[name=ant-speed').change(function() {
        canvas.setAntSpeed(this.value)
    });

    $('.random').click(function() {

        var numberOfNodes = parseInt(prompt("Number of Nodes"));

        if (!Number.isNaN(numberOfNodes) && numberOfNodes <= canvas.nodesLimit) {

            canvas.setClearAll();

            let positions = [];

            for (let i = 0; i < numberOfNodes; i++) {
                positions.push({
                    x: RandomUtils.nextFloat(0, canvas.width, 10),
                    y: RandomUtils.nextFloat(0, canvas.height, 10),
                });
            }

            canvas.addNode(positions);
        }
    });

    $('.examples').click(function(){

        $.get("examples/" + $(this).data("file"), function (result) {

            canvas.setClearAll();

            let numbers = [];

            result.split("\n").forEach(row => {

                let parts = row.trim().split(" ");

                if (parts.length == 1) {
                    return;
                }

                numbers.push([parseFloat(parts[1]), parseFloat(parts[2])]);
            });

            let mx = ArrayUtils.minAndMaxArray(numbers.map(e => e[0]));
            let my = ArrayUtils.minAndMaxArray(numbers.map(e => e[1]));

            let positions = [];

            numbers.forEach(number => {

                let x = number[0];
                let y = number[1];

                positions.push({
                    x: NormalizeUtils.normalizeAnyInterval(x, mx.min, mx.max, 0 + FabricjsUtils.NODE_RADIUS, canvas.width - FabricjsUtils.NODE_RADIUS),
                    y: NormalizeUtils.normalizeAnyInterval(y, my.min, my.max, 0 + FabricjsUtils.NODE_RADIUS, canvas.height - +FabricjsUtils.NODE_RADIUS),
                });
            });

            canvas.addNode(positions);
        });
    });

    resizeWindow();

    canvas.on("running", () =>{
        setToolbarActive(true);
    });

    canvas.on("stopped", () =>{
        setToolbarActive(false);
    });

    canvas.on("generationUpdated", function(data){
        $generationCounter.text(data.generation.toLocaleString("en-US", { maximumFractionDigits: 2 }));
        $bestValue.text(data.bestTourDistance.toLocaleString("en-US", { maximumFractionDigits: 2 }));
        chartGlobalBestValue.addPoint(data.bestTourDistance);
        chartAverageBestValue.addPoint(data.averageTourDistance);
    });
});
