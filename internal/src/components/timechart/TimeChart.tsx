import React, { MouseEvent, useRef, useEffect } from 'react';
import type { InteractionItem } from 'chart.js';
import { Bar, getElementAtEvent } from 'react-chartjs-2';
import colors from '../../colors';
import { toHoursAndMinutes } from '../../utils';
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
    title?: string;
    onDateChanged: (date: Date) => void;
    date: Date;
    dateRange: number;
    bgColorsStart?: number;
    labels: string[] | string[][];
    dataSeries: StackedDataSeries[];
    legendPosition?: string;
    visibility: boolean[];
}

export interface StackedDatasets {
    label: string;
    data: number[];
    stack: string;
    backgroundColor: string;
}
interface StackedBarData {
    labels: string[] | string[][];
    datasets: StackedDatasets[];
}
export interface StackedDataSeries {
    name: string;
    values: number[];
    stack: string;
}

function TimeChart(props: TimeChartProps) {
    // console.log('TimeChartProps: ',props)

    const chartRef = useRef<ChartJS>(null);
    useEffect(() => {
        for (let i = 0; i < props.visibility.length; i++) {
            chartRef.current.setDatasetVisibility(i, props.visibility[i]);
        }
        chartRef.current.update();
    }, [props.visibility]);
    //CONFIG
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: props.legendPosition ? true : false,
                position: props.legendPosition as 'chartArea',
            },
            title: {
                display: props.title ? true : false,
                text: props.title,
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
    const onClick = (event: MouseEvent<HTMLCanvasElement>) => {
        const { current: chart } = chartRef;
        if (!chart) {
            return;
        }
        handleElementAtEvent(getElementAtEvent(chart, event));
    };

    return (
        <>
            <div className="block">
                <Bar
                    ref={chartRef}
                    options={options}
                    /* @ts-ignore */
                    data={data}
                    /* @ts-ignore */
                    onClick={onClick}
                />
            </div>
        </>
    );
}
export default TimeChart;
