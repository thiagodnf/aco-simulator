class ChartUtils{

    static init(el){

        var chart = Highcharts.chart(el, {

            title: {
                text: null
            },

            xAxis: {
                title: {
                    text: "Generation"
                },
            },

            yAxis: {
                title: {
                    text: "Distance"
                },
                min: 0
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

            series: [{
                showInLegend: false,
                name: "Distance",
                data: []
            }],
        });

        return {
            chart: chart,
            addPoint: (value) => {
                if (!Number.isNaN(value)) {
                    chart.series[0].addPoint(value);
                }
            }
        };
    }
}
