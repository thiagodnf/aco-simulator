let url = null;
let canvas = null;
let chartGlobalShortestDistance = null;
let chartAverageShortestDistance = null;
let $generationCounter =    null;
let $shortestDistance = null;
let $shortestPath = [];

let $modalSettings = null;

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

    RandomUtils.setSeed(url.query.seed || new Date().getTime());

    canvas = new Canvas();
    chartGlobalShortestDistance = ChartUtils.init("chart-global-shortest-distance", "Global Shortest Distance", "#7cb5ec");
    chartAverageShortestDistance = ChartUtils.init("chart-average-shortest-distance", "Average Shortest Distance", "#90ed7d");
    $generationCounter = $(".generation-counter");
    $shortestDistance = $(".shortest-distance");
    $shortestPath = $("#shortest-path");
    $modalSettings = $("#modal-settings");

    $(".acs-parameters").hide();

    $(window).resize(resizeWindow);

    $(document).keyup(function (e) {
        if (["Backspace", "Delete"].includes(e.key)) {
            canvas.removeSelectedNodes();
        };
    });

    window.onerror = (errorMsg) => {
        BootBoxUtils.alert(errorMsg, `<i class="fas fa-exclamation-triangle me-2"></i>Ooops...`);
        return false;
    }

    $(".dropdown-item-no-click").click((event) =>{
        event.preventDefault();
        return false;
    })
    document.addEventListener("DOMContentLoaded", function () {

        // make it as accordion for smaller screens
        if (window.innerWidth < 992) {

            // close all inner dropdowns when parent is closed
            document.querySelectorAll('.navbar .dropdown').forEach(function (everydropdown) {
                everydropdown.addEventListener('hidden.bs.dropdown', function () {
                    // after dropdown is hidden, then find all submenus
                    this.querySelectorAll('.submenu').forEach(function (everysubmenu) {
                        // hide every submenu as well
                        everysubmenu.style.display = 'none';
                    });
                })
            });

            document.querySelectorAll('.dropdown-menu a').forEach(function (element) {
                element.addEventListener('click', function (e) {

                    let nextEl = this.nextElementSibling;

                    if (nextEl && nextEl.classList.contains('submenu')) {
                        // prevent opening link if link needs to open dropdown
                        e.preventDefault();
                        if (nextEl.style.display == 'block') {
                            nextEl.style.display = 'none';
                        } else {
                            nextEl.style.display = 'block';
                        }

                    }
                });
            })
        } // end if innerWidth
    });// DOMContentLoaded  end



    $("#play").click(() => {canvas.setPlay();});
    $("#step").click(() => { canvas.setStep();});
    $("#stop").click(() => canvas.setStop());

    $("#add-node").click(() => canvas.setAddNode());
    $("#move-node").click(() => canvas.setMoveNode());

    $('input[name=ant-speed').change(function() {
        canvas.setAntSpeed(this.value)
    });

    $("#menubar-clear-all").click(() => {
        BootBoxUtils.confirm("Are you sure you want to clear all?").then(() =>{
            canvas.setClearAll()
        });
    });

    $('#menubar-view-pheromones').change(() => canvas.toggleViewPheromones());

    $('#menubar-view-shortest-path').change(() => {
        canvas.toggleViewShortestPath()
    });




    $("#menubar-export-positions").click((event) => {

        let positions = [];

        canvas.environment.ants.forEach(ant =>{
            positions.push([ant.left, ant.top]);
        })

        FileUtils.exportToCSV(positions, "positions.csv");
    })

    $("#menubar-export-canvas").click((event) => {

        document.getElementById("canvas").toBlob(function(blob) {
            saveAs(blob, "canvas.png");
        });
    })

    $("#menubar-insert-circles").click((event) => {

        BootBoxUtils.promptNumber("Number of Circles", 1, 5, 2).then((value) => {

            canvas.setClearAll();

            canvas.addNode(GeneratorUtils.circle(parseInt(value)));
        });
    })

    $("#menubar-insert-squares").click((event) => {

        BootBoxUtils.promptNumber("Number of Squares", 1, 3, 2).then((value) => {

            canvas.setClearAll();

            canvas.addNode(GeneratorUtils.square(parseInt(value)));
        });
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

    $("#form-parameters").submit(event => {

        canvas.environment.alpha = parseFloat($('#alpha').val());
        canvas.environment.beta = parseFloat($('#beta').val());
        canvas.environment.rho = parseFloat($('#rho').val());
        canvas.environment.omega = parseFloat($('#omega').val());
        canvas.environment.q0 = parseFloat($('#q0').val());

        return false;
    });

    $modalSettings.on("show.bs.modal", (event) => {
        $("#random-seed").val(RandomUtils.seed)
    });

    $modalSettings.find("#form-settings").submit(event => {

        let aco = $(this).find("#aco").val().trim();
        let randomSeed = $(this).find("#random-seed").val().trim();

        canvas.setACO(aco);
        RandomUtils.setSeed(randomSeed);

        $(".acs-parameters").toggle(aco == "acs");

        $modalSettings.modal("hide")

        return false;
    });

    $("#btn-reset-default-values").click(event => {
        $("#form-parameters input").each(function(event){
            $(this).val($(this).data("default-value"));
        });
    });

    $('.random').click(function() {

        BootBoxUtils.promptNumber("Number of Nodes", 1, canvas.nodesLimit).then((value) => {

            canvas.setClearAll();

            let positions = [];

            for (let i = 0; i < value; i++) {
                positions.push({
                    x: RandomUtils.nextFloat(0, canvas.width, 10),
                    y: RandomUtils.nextFloat(0, canvas.height, 10),
                });
            }

            canvas.addNode(positions);
        });
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

    canvas.on("generationUpdated", function(canvas){

        $generationCounter.text(canvas.generation.toLocaleString("en-US", { maximumFractionDigits: 2 }));
        $shortestDistance.text(canvas.environment.bestTourDistance.toLocaleString("en-US", { maximumFractionDigits: 2 }));
        $shortestPath.val(canvas.environment.bestTour);

        chartGlobalShortestDistance.addPoint(canvas.environment.bestTourDistance);
        chartAverageShortestDistance.addPoint(canvas.environment.averageTourDistance);
    });
});
