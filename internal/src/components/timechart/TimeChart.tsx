import React, { MouseEvent, useRef } from 'react';
import type { InteractionItem } from 'chart.js';
import { Bar, getElementAtEvent } from 'react-chartjs-2';
import colors from '../../colors';
import {toHoursAndMinutes} from '../../utils'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface TimeChartProps {
    onDateChanged: (date: Date) => void;
    date: Date;
    dateRange: number;
    bgColorsStart: number;
    labels: string[] | string[][];
    dataSeries: StackedDataSeries[];
}

export interface StackedDatasets {
    label: string;
    data: number[];
    stack: string;
    backgroundColor: string;
}
interface StackedBarData {
    labels: any;
    datasets: StackedDatasets[];
}
export interface StackedDataSeries {
    name: string;
    values: number[];
    stack: string;
}

function TimeChart(props: TimeChartProps) {
    // console.log('TimeChartProps: ',props)
//CONFIG
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right' as const,
            },
            title: {
                display: false,
                text: 'Chart.js Bar Chart',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label} ${toHoursAndMinutes(
                            context.raw
                        )}`;
                    },
                },
            },
        },
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
                ticks: {
                    stepSize: 60,
                    callback: function (value) {
                        return toHoursAndMinutes(value);
                    },
                },
                suggestedMax: 510,
            },
        },
    };
// DATA
    const datasets: StackedDatasets[] = [];
    for (let i = 0; i < props.dataSeries.length; i++) {
        const dataset: StackedDatasets = {
            label: props.dataSeries[i].name,
            data: props.dataSeries[i].values,
            stack: props.dataSeries[i].stack,
            backgroundColor: colors.bgColors[i + props.bgColorsStart],
        };
        datasets.push(dataset);
    }
    const data: StackedBarData = {
        labels: props.labels,
        datasets,
    };
//ACTIONS
    const handleElementAtEvent = (element: InteractionItem[]) => {
        if (!element.length) return;

        const { index } = element[0];
        let prevD = new Date(props.date);
        new Date(prevD.setDate(prevD.getDate() - (props.dateRange - index)));
        props.onDateChanged(prevD);
    };

    const chartRef = useRef<ChartJS>(null);

    const onClick = (event: MouseEvent<HTMLCanvasElement>) => {
        const { current: chart } = chartRef;
        if (!chart) {
            return;
        }
        handleElementAtEvent(getElementAtEvent(chart, event));
    };

    
    // interface PieGroup {
    //     name: string;
    //     value: number;
    //     on: boolean;
    // }

    // const pieGroups = dataSeries.map((item) => {
    //     const values = item.values
    //     const sum = values.reduce((accumulator, value) => {
    //         return accumulator + value;
    //       }, 0);
    //     return {
    //         name: item.name,
    //         value: sum,
    //         on: true,
    //     }
    // });

    // setLegendData(pieGroups);

    // const onLegendRowToggle = (rowIndex: number) => {
    //     const updatedlegendData = [...legendData];
    //     updatedlegendData[rowIndex].on = !updatedlegendData[rowIndex].on;
    //     setLegendData(updatedlegendData);
    //   };

    return (
        <>
            <div className="block">
                <Bar
                    ref={chartRef}
                    options={options}
                    data={data}
                    /* @ts-ignore */
                    onClick={onClick}
                />
            </div>
        </>
    );
}
export default TimeChart;
