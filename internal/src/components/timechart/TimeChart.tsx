import React, { MouseEvent, useRef } from 'react';
import type { InteractionItem } from 'chart.js';
import { Bar, getElementAtEvent } from 'react-chartjs-2';
import { TaskList, TimeEntry } from '../../SPS';
import { isSameDay } from 'date-fns';
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
  taskData: TaskList[];
}

function toHoursAndMinutes(totalMinutes) {
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);

  return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}`;
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'right' as const,
    },
    title: {
      display: false,
      text: 'Chart.js Bar Chart',
    },
    tooltip:{      
      callbacks: {
        label: function(context){
          return `${context.dataset.label} ${toHoursAndMinutes(context.raw)}`
          }
        }
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
        callback:  function(value) {
          return toHoursAndMinutes(value)
        },
      },
      suggestedMax: 510,
    },
  },
};

const datasetsLabel: string[] = ['Arbejdstid'];

const datasetsBgColor: string[] = ['rgba(62, 142, 208, 0.5)'];

function TimeChart(props: TimeChartProps) {
  let labelList: string[] = [];

  let currentDate = new Date(props.date);
  const dateRange = 13;
  currentDate.setDate(currentDate.getDate() - dateRange);
  let labels: string[][] = [];
  let dataset: number[] = [];
  for (let i = 0; i <= dateRange; i++) {
    const labelPair: string[] = [];
    labelPair.push(new Intl.DateTimeFormat('da-DK', { weekday: 'short'}).format(currentDate));
    labelPair.push(currentDate.toLocaleDateString('da-DK', { month: 'short', day: 'numeric' }));
    labels.push(labelPair)

    let filteredTasks = props.data.filter((te) => isSameDay(te.date, currentDate ));

    // console.log('filteredTasks: ',typeof filteredTasks,filteredTasks)

    // datasets: [
    //   {
    //     label: 'Dataset 1',
    //     data: Utils.numbers(NUMBER_CFG),
    //     backgroundColor: Utils.CHART_COLORS.red,
    //   },
    //   {
    //     label: 'Dataset 2',
    //     data: Utils.numbers(NUMBER_CFG),
    //     backgroundColor: Utils.CHART_COLORS.blue,
    //   },
    //   {
    //     label: 'Dataset 3',
    //     data: Utils.numbers(NUMBER_CFG),
    //     backgroundColor: Utils.CHART_COLORS.green,
    //   },
    // ]


    for (let j = 0; j<filteredTasks.length; j++) {

    // console.log('filteredTasks[j].taskId: ',filteredTasks[j].taskId)
    }

    let sumTime = filteredTasks.reduce((accumulator, object) => {
      return accumulator + object.time;
    }, 0);

    // console.log('sumTime: ',typeof sumTime,sumTime)

    dataset.push(sumTime);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  let datasetsData: number[][] = [];
  datasetsData.push(dataset);
  
    // console.log('datasetsData: ',typeof datasetsData,datasetsData)
  const data = {
    labels,
    datasets: [
      {
        label: datasetsLabel[0],
        data: datasetsData[0],
        backgroundColor: datasetsBgColor[0],
      },
    ],
  };


  const handleElementAtEvent = (element: InteractionItem[]) => {
    if (!element.length) return;

    const { index } = element[0];
    let prevD = new Date(props.date);
    new Date(prevD.setDate(prevD.getDate() - (13 - index)));
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
  return <Bar 
    ref={chartRef} 
    options={options} 
    data={data} 
/* @ts-ignore */
    onClick={onClick} 
  />;
}
export default TimeChart;
