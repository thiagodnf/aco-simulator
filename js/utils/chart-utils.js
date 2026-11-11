class ChartUtils {

    static init(el, title, borderColor, backgroundColor) {

        const ctx = document.getElementById(el);

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: title,
                    data: [],
                    borderColor,
                    backgroundColor
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
            addPoint: (value) => {
                if (value && !Number.isNaN(value)) {
                    chart.data.labels.push(label++);
                    chart.data.datasets.forEach((dataset) => {
                        dataset.data.push(value);
                    });
                    chart.update();
                }
            },
            setHeight: (value) => {
                // chart.setSize(undefined, value, false);
            }
        };
    }
}
