import Chart from 'chart.js/auto';
let myChart = null;
let myChart2 = null;
const chartAreaBorder = {
    id: 'chartAreaBorder',
    afterDatasetsDraw(chart, options) {
        const { ctx, chartArea: { top, bottom, left, right, width, height } } = chart
        ctx.save()

        ctx.fillStyle = options.borderColor
        ctx.strokeRect(right, top, 0, height)
        ctx.strokeRect(left, top, 0, height)
        ctx.strokeRect(left, top, width, 0)
        ctx.strokeRect(left, bottom, width, 0)
        ctx.restore()
    }
}
export function createChart(ctx) {
    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Баланс',
                data: [],
                backgroundColor: '#116ACC',
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: 10000,

                    position: 'right',
                    grid: {
                        display: false
                    },
                    ticks: {
                        callback: function(value) {
                            if (value === 0 || value === 10000) {
                                return value;
                            } else {
                                return "";
                            }
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                chartAreaBorder: {
                    borderColor: '#333'
                }
            }
        },
        plugins: [chartAreaBorder]
    });
}


export function updateChart(labels, data) {
    myChart.data.labels = labels;
    myChart.data.datasets[0].data = data;
    myChart.update();
}

export function createChart2(ctx) {
    if (myChart2) {
        myChart2.destroy();
    }

    myChart2 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Баланс',
                data: [],
                backgroundColor: [],
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10000,
                    position: 'right',
                    grid: {
                        display: false
                    },
                    ticks: {
                        callback: function(value) {
                            if (value === 0 || value === 10000 / 2 || value === 10000) {
                                return value;
                            } else {
                                return "";
                            }
                        }
                    },
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                chartAreaBorder: {
                    borderColor: '#333'
                }
            },
        },
        plugins: [chartAreaBorder]
    });
}

function getGradient(ctx, chartArea, transitionPoint) {
    const gradientBg = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    const safeTransitionPoint = Math.min(Math.max(transitionPoint, 0), 1);
    gradientBg.addColorStop(0, '#76CA66');
    gradientBg.addColorStop(safeTransitionPoint, '#76CA66');
    gradientBg.addColorStop(safeTransitionPoint, '#FD4E5D');
    gradientBg.addColorStop(1, '#FD4E5D');

    return gradientBg;
}
export function updateChart2(labels, data, transactions, accountId) {
    let positiveTotal = 0;
    let negativeTotal = 0;

    transactions.forEach(transaction => {
        if (transaction.from === accountId) {
            negativeTotal += Math.abs(transaction.amount);
        } else if (transaction.to === accountId) {
            positiveTotal += Math.abs(transaction.amount);
        }
    });
    const cachedSmoothedRatio = parseFloat(localStorage.getItem('smoothedPositiveRatio'));
    const totalAmount = positiveTotal + negativeTotal;
    const positiveRatio = Math.min(Math.max(positiveTotal / totalAmount, 0), 1);
    const smoothedPositiveRatio = Math.pow(positiveRatio, 0.5);
    if (isNaN(cachedSmoothedRatio) || cachedSmoothedRatio !== smoothedPositiveRatio) {
        localStorage.setItem('smoothedPositiveRatio', smoothedPositiveRatio.toString());
    }
    myChart2.data.labels = labels;
    myChart2.data.datasets[0].data = data;
    myChart2.data.datasets[0].backgroundColor = (context) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) {
            return;
        }
        return getGradient(ctx, chartArea, smoothedPositiveRatio);
    }

    myChart2.update();
}