import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface TaskBarchartProps {
    data: unknown[];
    // title?: string;
    // setTaskDate: (date: Date) => void;
    // date: Date;
    // dateRange: number;
    // bgColorsStart?: number;
    // labels: string[] | string[][];
    // dataSeries: StackedDataSeries[];
    // legendPosition?: string;
    // visibility: boolean[];
    // omittedFromSum?: string;
}

const TaskBarchart = (props: TaskBarchartProps) => {
    // console.log('TaskBarchartProps: ',props)

    // CONFIG
    const options = {
        indexAxis: 'y' as const,
        elements: {
            bar: {
                borderWidth: 2,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'right' as const,
            },
            title: {
                display: true,
                text: 'Tidsforbrug fordelt på opgaver',
            },
        },
    };

    // DATA
    
    const labels = props.data.map((k)=> Object.keys(k)[0])
    const barData: number[] = []
    labels.forEach(element => {
    barData.push(props.data.find((k) => Object.keys(k)[0] === element)[element])
    });

    const data = {
        labels,
        datasets: [
            {
                label: 'Opgaver',
                data: barData,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            // {
            //     label: 'Dataset 2',
            //     data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
            //     borderColor: 'rgb(53, 162, 235)',
            //     backgroundColor: 'rgba(53, 162, 235, 0.5)',
            // },
        ],
    };

    // ACTIONS
    return (
        <>
            <Bar options={options} data={data} />
        </>
    );
};
export default TaskBarchart;