// Import statements
import React, { MouseEvent, useRef } from 'react';
import type { InteractionItem, InteractionMode } from 'chart.js';
import { Bar, getElementAtEvent } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { StackedBarData, StackedDataSeries, StackedDatasets } from '../timechart/TimeChart';
import { toHoursAndMinutes } from '../../utils';
import colors from '../../colors';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface FlexTimeBalanceProps {
    // data: StackedBarData;
    year: number;
    month:number;
    title?: string;
    // setTaskDate: (date: Date) => void;
    // date: Date;
    // dateRange: number;
    bgColorsStart?: number;
    labels: string[] | string[][];
    dataSeries: StackedDataSeries[];
    legendPosition?: string;
    // visibility: boolean[];
    // omittedFromSum?: string;
    setTaskDate: (newTaskDate) => void;
}

const FlexTimeBalance = (props: FlexTimeBalanceProps) => {
    // console.log('FlexTimeBalanceProps: ',props)

    const chartRef = useRef<ChartJS<'bar', number[]>>(null);
    // CONFIG
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
                        return `${context.dataset.label} ${toHoursAndMinutes(context.raw)}`;
                    },
                },
            },
        },
        interaction: {
            intersect: false,
            mode: 'index' as InteractionMode,
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
            label: props.dataSeries[i].projectName,
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

    // ACTIONS
    const handleElementAtEvent = (element: InteractionItem[]) => {
        if (!element.length) return;
        const { index } = element[0];
        const newTaskDate = new Date(props.year,props.month,1+index);
        console.log('InteractionItem:', newTaskDate);
        props.setTaskDate(newTaskDate)
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
            <Bar ref={chartRef} options={options} data={data} onClick={onClick} />
        </>
    );
};
export default FlexTimeBalance;
