class ChartUtils{

    static init(el, title, color=undefined){

        var chart = Highcharts.chart(el, {

            chart: {
                height: 180,
            },

            title: {
                text: title,
                style: {
                    fontSize: '14px'
                 }
            },

            xAxis: {
                title: {
                    text: "Generation"
                },
            },

            credits: {
                enabled: false
            },

            yAxis: {
                title: {
                    text: null
                },
                min: 0,
            },

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            enabled: false
                        }
                    }
                }]
            },

            plotOptions: {
                series: {
                    pointStart: 1
                }
            },

            series: [{
                showInLegend: false,
                color: color,
                name: "Distance",
                data: []
            }],
        });

        return {
            chart: chart,
            addPoint: (value) => {
                if (value && !Number.isNaN(value)) {
                    chart.series[0].addPoint(value);
                }
            },
            setHeight: (value) => {
                chart.setSize(undefined, value, false);
            }
        };
    }
}
