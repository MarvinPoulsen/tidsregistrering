import React, { MouseEvent, useRef } from 'react';
import type { InteractionItem } from 'chart.js';
import { Bar, getElementAtEvent } from 'react-chartjs-2';
import { Project, Task, TimeEntry } from '../../SPS';
import { isSameDay } from 'date-fns';
import colors from '../../colors';
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
    data: TimeEntry[];
    taskData: Task[];
    projectList: Project[];
    displayRange: number;
    bgColorsStart: number;
}

function toHoursAndMinutes(totalMinutes) {
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);

    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}`;
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
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
interface StackedDataSeries {
    name: string;
    values: number[];
    stack: string;
}

function TimeChart(props: TimeChartProps) {
    // console.log('TimeChartProps: ',props)
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
    let currentDate = new Date(props.date);
    const dateRange = props.displayRange - 1;
    currentDate.setDate(currentDate.getDate() - dateRange);
    const filterData = props.data.filter((a) => {
        var date = new Date(a.date);
        return date >= currentDate && date <= props.date;
    });
    const tasks = filterData.map((element) => {
        const task = props.taskData.find((t) => t.id === element.taskId);
        const project = props.projectList.find((p) => p.id === task.projectId);
        return {
            taskDate: element.date,
            taskTime: element.time,
            // taskName: task.name,
            // projectId: task.projectId,
            projectName: project.name,
        };
    });
    let projectList: string[] = [];
    projectList = projectList.concat(tasks.map((item) => item.projectName));
    const projects: any[] = [...new Set(tasks.map((item) => item.projectName))];

    let dataSeries: StackedDataSeries[] = [];
    projects.forEach((element) => {
        const filteredProjects = tasks.filter((p) => p.projectName === element);
        let dateCopy = new Date(props.date.getTime());
        dateCopy.setDate(dateCopy.getDate() - dateRange);

        let values: number[] = [];
        for (let i = 0; i <= dateRange; i++) {
            let filteredByDate = filteredProjects.filter((d) =>
                isSameDay(d.taskDate, dateCopy)
            );
            values.push(
                filteredByDate.reduce(
                    (total, currentItem) =>
                        (total = total + (currentItem.taskTime || 0)),
                    0
                )
            );
            dateCopy.setDate(dateCopy.getDate() + 1);
        }
        dataSeries.push({ name: element, values, stack: '0' });
    });

    let labels: string[][] = [];
    for (let i = 0; i <= dateRange; i++) {
        const labelPair: string[] = [];
        labelPair.push(
            new Intl.DateTimeFormat('da-DK', { weekday: 'short' }).format(
                currentDate
            )
        );
        labelPair.push(
            currentDate.toLocaleDateString('da-DK', {
                month: 'short',
                day: 'numeric',
            })
        );
        labels.push(labelPair);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // DATA
    const datasets: StackedDatasets[] = [];
    for (let i = 0; i < dataSeries.length; i++) {
        const dataset: StackedDatasets = {
            label: dataSeries[i].name,
            data: dataSeries[i].values,
            stack: dataSeries[i].stack,
            backgroundColor: colors.bgColors[i + props.bgColorsStart],
        };
        datasets.push(dataset);
    }
    const data: StackedBarData = {
        labels,
        datasets,
    };

    const handleElementAtEvent = (element: InteractionItem[]) => {
        if (!element.length) return;

        const { index } = element[0];
        let prevD = new Date(props.date);
        new Date(prevD.setDate(prevD.getDate() - (dateRange - index)));
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
    return (
        <Bar
            ref={chartRef}
            options={options}
            /* @ts-ignore */
            data={data}
            /* @ts-ignore */
            onClick={onClick}
        />
    );
}
export default TimeChart;
