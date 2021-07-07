let url = null;
let canvas = null;
let chartGlobalBestValue = null;
let chartAverageBestValue = null;
let $generationCounter =    null;
let $bestValue = null;
let $bestSolution = [];

function resizeWindow() {

    let canvasHeight = $(window).height() - $("#canvas").offset().top - $("footer").height() - 30;

    canvas.resize($(".col-lg-9").width(), canvasHeight);

    $("#sidebar").height(canvasHeight - 2);
}

function setToolbarActive(active){
    $(".disable-when-playing button").prop( "disabled", active );
    $(".disable-when-playing input").prop( "disabled", active );
    $(".disable-when-playing #stop").prop( "disabled", !active );
}

$(function () {

    url = new Url;

    RandomUtils.setSeed(url.query.seed);

    canvas = new Canvas();
    chartGlobalBestValue = ChartUtils.init("chart-global-best-value", "Global Best Value", "#7cb5ec");
    chartAverageBestValue = ChartUtils.init("chart-average-best-value", "Average Best Value", "#90ed7d");
    $generationCounter = $(".generation-counter");
    $bestValue = $(".best-value");
    $bestSolution = $("#best-solution")

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

    $("#menu-export").click((event) => {

        let positions = [];

        canvas.environment.ants.forEach(ant =>{
            positions.push([ant.left, ant.top]);
        })

        FileUtils.exportToCSV(positions, "output.csv");
    })

    $("#form-import-csv").submit(event => {

        let csvFile = $(this).find("#csv-file").prop('files')[0];
        let hasHeader = $(this).find("#has-header").is(':checked');

        FileUtils.readCSV(csvFile, hasHeader, (positions) => {

            canvas.setClearAll();

            canvas.addNode(positions);

            $("#modal-import-csv").modal("hide")
        });

        return false;
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

            let positions = FileUtils.parseContent(result, false);

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
        $bestSolution.val(data.bestTour);

        chartGlobalBestValue.addPoint(data.bestTourDistance);
        chartAverageBestValue.addPoint(data.averageTourDistance);
    });
});
