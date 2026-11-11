class ChartUtils {

    static init(el, title, borderColor, backgroundColor) {

        const ctx = document.getElementById(el);

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: "global",
                    data: [],
                    borderColor: "#36A2EB",
                    backgroundColor: "#9BD0F5"
                },{
                    label: "average",
                    data: [],
                    borderColor: "#FF6384",
                    backgroundColor: "#FFB1C1"
                }]
            },
            options: {
                scales: {
                    y: {
                        min: 0
                    }
                }
            }
        });

        let label = 1;

        return {
            chart,
            addPointTo: (globalValue, averageValue) => {
                if (globalValue && !Number.isNaN(globalValue)) {
                    chart.data.labels.push(label++);

                    chart.data.datasets[0].data.push(globalValue);
                    chart.data.datasets[1].data.push(averageValue);

                    chart.update();
                }
            },

            setHeight: (value) => {
                // chart.setSize(undefined, value, false);
            }
        };
    }
}
