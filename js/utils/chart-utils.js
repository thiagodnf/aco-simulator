class ChartUtils{

    static init(el, color=undefined){

        var chart = Highcharts.chart(el, {

            chart: {
                height: 150,
            },

            title: {
                text: null
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
            }
        };
    }
}
