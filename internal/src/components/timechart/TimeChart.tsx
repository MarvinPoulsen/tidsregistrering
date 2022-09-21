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
  // console.log('TimeChartProps: ',props)


  let currentDate = new Date(props.date);
  const dateRange = 13;
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
  const uniqueTaskList: number[] = [...new Set<number>(taskList)];

  for (let j = 0; j<uniqueTaskList.length; j++){
    const taskId: number = uniqueTaskList[j];
    const labelName = props.taskData.filter((task) => task.id === taskId)[0].name
    // console.log('labelName: ',labelName)
        for (let k = 0; k < dateList.length; k++) {
          const date = dateList[k];
          // console.log('date: ',date)
        }
  }
  //   let dataset: number[] = [];
  //   let currentDate = new Date(props.date);
  //   let filteredTasks = props.data.filter((te) => te.taskId === taskId);
  //     for (let i = 0; i <= dateRange; i++) {
  //       let data = filteredTasks.filter((te) => isSameDay(te.date, currentDate ));
  //       let sumData = data.reduce((accumulator, object) => {
  //         return accumulator + object.time;
  //       }, 0);
  //       dataset.push(sumData);
  //       currentDate.setDate(currentDate.getDate() + 1);
  //     }


      // console.log('dataset: ',dataset)

  





  //     datasets.push({
  //   name: props.taskData.filter((task) => task.id === taskId)[0].name,
  //   values:
  //     parishCode && parishCode !== ''
  //       ? parishData.map((row) => row.uskadte)
  //       : sumParishData.map((row) => row.uskadte),
  //   stack: '0',
  // });


  // }





  // console.log('dataset: ',dataset)
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
