import React, { MouseEvent, useRef } from 'react';
import type { InteractionItem } from 'chart.js';
import { Bar, getElementAtEvent } from 'react-chartjs-2';
import { Task, TimeEntry } from '../../SPS';
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
  taskData: Task[];
  displayRange: number;
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

interface StackedDatasets {
  label: string;
  data: number[];
  stack: string;
  backgroundColor: string;
}
  // DATA
  const datasets: StackedDatasets[] = [];


const datasetsLabel: string[] = ['Arbejdstid'];

const datasetsBgColor: string[] = ['rgba(62, 142, 208, 0.5)'];

function TimeChart(props: TimeChartProps) {

  let currentDate = new Date(props.date);
  const dateRange = props.displayRange-1;
  currentDate.setDate(currentDate.getDate() - dateRange);
  let taskList: number[] = [];
  let dateList: Date[] = [];
  let labels: string[][] = [];
  let dataset: number[] = [];
    for (let i = 0; i <= dateRange; i++) {
    const labelPair: string[] = [];
    labelPair.push(new Intl.DateTimeFormat('da-DK', { weekday: 'short'}).format(currentDate));
    labelPair.push(currentDate.toLocaleDateString('da-DK', { month: 'short', day: 'numeric' }));
    labels.push(labelPair)
    let filteredTasks = props.data.filter((te) => isSameDay(te.date, currentDate ));
    let sumTime = filteredTasks.reduce((accumulator, object) => {
      return accumulator + object.time;
    }, 0);
    dataset.push(sumTime);
    taskList = taskList.concat(filteredTasks.map(item=>item.taskId))
    dateList.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  let datasetsData: number[][] = [];
  datasetsData.push(dataset);
  
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
