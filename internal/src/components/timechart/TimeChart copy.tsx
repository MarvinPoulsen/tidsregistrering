import React, { MouseEvent, useRef }  from 'react';
import type { InteractionItem } from 'chart.js';
import { Bar, getElementAtEvent  } from 'react-chartjs-2';
import { TimeEntry } from '../../SPS';
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

interface TimeChartProps{
  date: Date;
  data: TimeEntry[];
}

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
      text: 'Chart.js Bar Chart',
    },
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true
    }
  }
};
// const labels: string[] = ['04/23/2022', '04/24/2022','04/25/2022', '04/26/2022', '04/27/2022', '04/28/2022','04/29/2022'];
const datasetsLabel: string[] = ['Arbejdstid'];
// const datasetsData: number[][] = [[0, 0, 7, 7, 7, 9.5, 5, 0, 0, 8, 6, 7, 10, 5]];
const datasetsBgColor: string[] = ['rgba(62, 142, 208, 0.5)'];

function TimeChart(props: TimeChartProps){
  let d = new Date(props.date);
  d.setDate(d.getDate() - 13);
  console.log('d: ',d)
  let labels: string[] = [];
  let dataset: number[] = [];
  for (let i = 0; i < 14; i++) {
    labels.push(d.toLocaleDateString('da-DK',{ month: 'short', day: 'numeric' }));
    let filteredTasks = props.data.filter((te)=>isSameDay(te.date, d));
    let sumTime = filteredTasks.reduce((accumulator, object) => {
      return accumulator + object.time;
    }, 0);
    dataset.push(sumTime)
    d.setDate(d.getDate() + 1);
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
      }
    ]
  };


  

  const printElementAtEvent = (element: InteractionItem[]) => {
    if (!element.length) return;

    const { datasetIndex, index } = element[0];
    console.log('d2: ',d)
    let prevD = new Date(props.date);
    console.log('prevD: ',prevD)
    console.log('index: ',13 - index)

    // console.log('setdate: ',prevD.setDate(prevD.getDate() - index));
    console.log('setdate: ',new Date(prevD.setDate(prevD.getDate() - (13 - index))));
    // console.log('old: ',13-index, data.labels[index], data.datasets[datasetIndex].data[index]);
  };


  const chartRef = useRef<ChartJS>(null);

  const onClick = (event: MouseEvent<HTMLCanvasElement>) => {
    const { current: chart } = chartRef;

    if (!chart) {
      return;
    }
    printElementAtEvent(getElementAtEvent(chart, event));
  };
  
  return (
    <Bar
    ref={chartRef}
      options={options} 
      data={data} 
      onClick={onClick}
    />
  );
}
export default TimeChart